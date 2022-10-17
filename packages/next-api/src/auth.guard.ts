import { AccessToken, User } from "@ayuskey/models";
import { InjectRepository } from "@ayuskey/nestjs-typeorm";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { Repository } from "typeorm";
import { getToken, validateToken } from "./utils/authenticate";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        const token = getToken(req)
        if (!token) {
            return false
        }
        

        const user = this.userRepository.findOne({token: token})
        if (!user) return false

        return true
        // return req
    }
}