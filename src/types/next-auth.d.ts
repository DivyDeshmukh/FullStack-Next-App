import "next-auth";
import { DefaultSession } from "next-auth";

// when we want to make changes in the types of libs or packages then we have to do it like this. We cannot do it using interface
declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  },
  interface Session {
    user: {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}
