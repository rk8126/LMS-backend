export namespace CommonTypes {
  export type ValidationPayload = {
    _id: string;
    email: string;
    fullName: string;
  };

  export type IAdminUser = {
    accessToken: string;
  };

  export type IStudent = {
    accessToken: string;
  };

  export type UserRequest = {
    user: {
      _id: string;
      email: string;
      fullName: string;
    };
  };
}
