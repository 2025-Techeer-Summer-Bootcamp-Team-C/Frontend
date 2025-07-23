import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "@/types/user";
import { useLoginMutation, useLogoutMutation, useSignUpMutation } from "@/hooks/useAuth";
import axiosInstance from "@/api/axiosInstance";

interface AuthUser {
  id: number;
  username: string;
  email: string;
  name?: string; // 프로필에서 사용하는 실명
  phone?: string; // 전화번호
  profileImage?: string | null; // 프로필 이미지 URL
  image?: string; // API에서 제공하는 이미지 필드
  credit: number;
  user_gender: "M" | "F";
  created_at: string;
  updated_at: string;
  addresses?: Address[]; // 주소 목록
}

interface Address {
  id: string;
  name: string;
  recipient: string;
  full: string;
  zipcode: string;
  phone: string;
  isDefault: boolean;
}

interface AuthContextType {
  // 사용자 상태
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // 인증 함수들
  login: ReturnType<typeof useLoginMutation>['mutate'];
  logout: ReturnType<typeof useLogoutMutation>['mutate'];
  signUp: ReturnType<typeof useSignUpMutation>['mutate'];
  
  // 사용자 정보 업데이트
  updateUserProfile: (userData: Partial<AuthUser>) => Promise<void>;
  updateProfileImage: (imageFile: File | null) => Promise<void>;
  
  // 주소 관리
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  
  // 유틸리티
  refreshUserInfo: () => Promise<void>;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // React Query hooks
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const signUpMutation = useSignUpMutation();

  // 인증 상태 확인
  const checkAuthStatus = () => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    
    if (token && !user) {
      // 토큰이 있지만 사용자 정보가 없으면 사용자 정보 가져오기
      refreshUserInfo();
    } else if (!token) {
      setUser(null);
      setIsLoading(false);
    }
  };

  // 사용자 정보 가져오기
  const refreshUserInfo = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // 사용자 정보 API 호출 (백엔드에 사용자 정보 조회 API가 있다고 가정)
      const response = await axiosInstance.get<User>('/api/v1/users/profile');
      
      // API 응답을 AuthUser 형태로 변환
      const userData: AuthUser = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        name: response.data.username, // 기본값으로 username 사용
        profileImage: response.data.image,
        image: response.data.image,
        credit: response.data.credit,
        user_gender: response.data.user_gender,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        // Mock 데이터 (실제로는 별도 API에서 가져와야 함)
        phone: "010-1234-5678",
        addresses: [
          {
            id: "1",
            name: "집",
            recipient: response.data.username,
            full: "서울시 강남구 테헤란로 123",
            zipcode: "06142",
            phone: "010-1234-5678",
            isDefault: true,
          }
        ]
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      // 토큰이 유효하지 않은 경우
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 프로필 업데이트
  const updateUserProfile = async (userData: Partial<AuthUser>) => {
    try {
      // 사용자 정보 업데이트 API 호출 (백엔드 구현 필요)
      await axiosInstance.patch('/api/v1/users/profile', {
        username: userData.username,
        email: userData.email,
        name: userData.name || userData.username,
        phone: userData.phone
      });

      // 로컬 상태 업데이트
      setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      throw error;
    }
  };

  // 프로필 이미지 업데이트
  const updateProfileImage = async (imageFile: File | null) => {
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('profile_image', imageFile);
      }

      // 프로필 이미지 업데이트 API 호출 (백엔드 구현 필요)
      const response = await axiosInstance.patch('/api/v1/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 로컬 상태 업데이트
      setUser(prevUser => prevUser ? { 
        ...prevUser, 
        profileImage: response.data.image,
        image: response.data.image
      } : null);
    } catch (error) {
      console.error("프로필 이미지 업데이트 실패:", error);
      throw error;
    }
  };

  // 주소 추가
  const addAddress = async (addressData: Omit<Address, 'id'>) => {
    try {
      // 주소 추가 API 호출 (백엔드 구현 필요)
      const response = await axiosInstance.post('/api/v1/users/addresses', addressData);
      
      const newAddress: Address = {
        id: response.data.id,
        ...addressData
      };

      setUser(prevUser => prevUser ? {
        ...prevUser,
        addresses: [...(prevUser.addresses || []), newAddress]
      } : null);
    } catch (error) {
      console.error("주소 추가 실패:", error);
      throw error;
    }
  };

  // 주소 업데이트
  const updateAddress = async (addressId: string, addressData: Partial<Address>) => {
    try {
      // 주소 업데이트 API 호출 (백엔드 구현 필요)
      await axiosInstance.patch(`/api/v1/users/addresses/${addressId}`, addressData);

      setUser(prevUser => prevUser ? {
        ...prevUser,
        addresses: prevUser.addresses?.map(addr => 
          addr.id === addressId ? { ...addr, ...addressData } : addr
        )
      } : null);
    } catch (error) {
      console.error("주소 업데이트 실패:", error);
      throw error;
    }
  };

  // 주소 삭제
  const removeAddress = async (addressId: string) => {
    try {
      // 주소 삭제 API 호출 (백엔드 구현 필요)
      await axiosInstance.delete(`/api/v1/users/addresses/${addressId}`);

      setUser(prevUser => prevUser ? {
        ...prevUser,
        addresses: prevUser.addresses?.filter(addr => addr.id !== addressId)
      } : null);
    } catch (error) {
      console.error("주소 삭제 실패:", error);
      throw error;
    }
  };

  // 기본 주소 설정
  const setDefaultAddress = async (addressId: string) => {
    try {
      // 기본 주소 설정 API 호출 (백엔드 구현 필요)
      await axiosInstance.patch(`/api/v1/users/addresses/${addressId}/default`);

      setUser(prevUser => prevUser ? {
        ...prevUser,
        addresses: prevUser.addresses?.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        }))
      } : null);
    } catch (error) {
      console.error("기본 주소 설정 실패:", error);
      throw error;
    }
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 로그인 상태 변경 이벤트 리스너
  useEffect(() => {
    const handleLoginStatusChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("loginStatusChange", handleLoginStatusChange);
    return () => {
      window.removeEventListener("loginStatusChange", handleLoginStatusChange);
    };
  }, []);

  const contextValue: AuthContextType = {
    // 상태
    user,
    isAuthenticated,
    isLoading,
    
    // 인증 함수들
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    signUp: signUpMutation.mutate,
    
    // 사용자 정보 관리
    updateUserProfile,
    updateProfileImage,
    
    // 주소 관리
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    
    // 유틸리티
    refreshUserInfo,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};