export const getCurrentPath = () => window.location.pathname;

export const navigateTo = (to: string) => {
  window.history.pushState(null, '', to);
  // 커스텀 이벤트 발생 (경로가 바뀌었어! 라고 앱에 알림)
  window.dispatchEvent(new Event('pushstate'));
};