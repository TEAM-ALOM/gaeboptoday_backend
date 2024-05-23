declare module '@coffee-tree/sejong-auth-delegator' {
  export interface LoginRequestDto {
      userId: string;
      password: string;
  }

  export interface AuthDelegator {
      getAuthenticatedJsessionId(loginRequestDto: LoginRequestDto): Promise<string>;
      isAuthenticatedUser(loginRequestDto: LoginRequestDto): Promise<boolean>;
      getUserProfile(loginRequestDto: LoginRequestDto): Promise<any>; // 이 부분은 실제 반환되는 사용자 프로필 객체의 형태에 따라 변경해야 합니다.
      createLoginRequestDto(userId: string, password: string): LoginRequestDto;
  }

  const sejongAuthDelegator: () => AuthDelegator;
  export default sejongAuthDelegator;
}