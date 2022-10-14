/* eslint-disable @typescript-eslint/ban-ts-comment */
export const cookieExtractor =
  (cookieName: string) =>
  (request: Express.Request): string | null => {
    let token = null;
    // @ts-ignore
    if (request && request.cookies) {
      // @ts-ignore
      token = request.cookies[cookieName];
    }
    return token;
  };
