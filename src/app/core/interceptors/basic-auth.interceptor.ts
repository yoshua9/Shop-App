import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const apiUrl = environment.apiUrl;
    if (!request.url.startsWith('/api') && !request.url.startsWith(apiUrl)) {
      return next.handle(request);
    }

    const credentials = `${environment.apiKey}:`;
    const authorization = `Basic ${btoa(credentials)}`;

    const authRequest = request.clone({
      setHeaders: {
        Authorization: authorization,
      },
    });

    return next.handle(authRequest);
  }
}
