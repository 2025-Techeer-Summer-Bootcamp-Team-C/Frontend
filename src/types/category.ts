export const categoryMapping: Record<string, number[]> = {
  "모두 보기": [], // 빈 배열은 전체를 의미
  "상의": [1], // category_id 1
  "하의": [2], // category_id 2
  "아우터": [3], // category_id 3
};

export const getCategoryName = (categoryId: number): string => {
  for (const [categoryName, ids] of Object.entries(categoryMapping)) {
    if (ids.includes(categoryId)) {
      return categoryName;
    }
  }
  return "기타";
};