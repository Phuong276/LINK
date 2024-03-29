import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('apple-app-site-association')
  getAppleApp(res: Response) {
    const body = {
      applinks: {
        apps: [],
        details: [
          {
            appID: 'Y7LSW7GV2Q.odawara.point.app',
            paths: ['*'],
          },
          {
            appID: '678U9GD354.com.odawara.dev',
            paths: ['*'],
          },
        ],
      },
      webcredentials: {
        apps: ['Y7LSW7GV2Q.odawara.point.app'],
      },
    };

    return body;
  }
}
