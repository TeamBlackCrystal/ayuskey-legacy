import { User } from '@ayuskey/models';
import { InjectRepository } from '@ayuskey/nestjs-typeorm';
import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
  } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getToken } from './utils/authenticate';
  
  @Injectable()
  export class CurrentUserInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
  
    async intercept(context: ExecutionContext, handler: CallHandler) {
      const request = context.switchToHttp().getRequest();
      
      const token = getToken(request)
  
      if (token) {
        const user = await this.userRepository.findOne({token});
        request.currentUser = user;
      }
  
      return handler.handle();
    }
  }