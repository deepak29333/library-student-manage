export const success = <T>(data: T, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string) => ({
  success: false,
  message,
  data: null,
});
