import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';

describe('Auth', () => {
  let app: INestApplication;

  const cognitoUserSession = {
    "idToken": {
      "jwtToken": "eyJraWQiOiI1bDJQNUcxbHQwWTI4MXdHOGVGVnJXbjBnUDFnN2p4WE9PRjRjb09rQUVBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZDk3Yzc4Ni04MGE0LTQxMmUtYWRkMy0zMTE0Y2Y0ZDI1ZmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfcVBVa0wzVXBFIiwiY29nbml0bzp1c2VybmFtZSI6InNoYXlhbmsiLCJvcmlnaW5fanRpIjoiNWNiMmRiMjEtN2ZiOC00MjUxLWJlNDQtNWZhNDM1OWExOTc5IiwiYXVkIjoiMnZzMmlsbWk3NzdjMzltOXMwYTVrM3NuYTIiLCJldmVudF9pZCI6ImE0NmFmMmYwLWVkZTQtNGNiMC05ODIzLTk5ODQ4MjE0MWYzNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjc3MjY4Njk2LCJleHAiOjE2NzcyNzIyOTYsImlhdCI6MTY3NzI2ODY5NiwianRpIjoiZGNiZDc5NDgtYTJlZC00YjRmLWEwNmYtMDlmNDA2Nzc4N2RjIiwiZW1haWwiOiJzaGF5YW4ua2FyYW1pQGNvcGlhdGVrLm5sIn0.XM41EK8mozI_T5cOfg_IAbqvU6xs7_qI8t4jso08W1HGNkOFXWXVyzF9hkf75297SnqzQc8bT46a_ZRsMwYpsrPNV3e00l5VqY5o3gfnUcWFJkFWTCQeQjJHicY97zooSSKfTUcs-xeWakOe-1dVVwbiI-6loQBACSy5DYjX5H2sfo_6tK6Oi8k3eqSot0YqEZ5rLv4IE608VD5NdNgX0LuymWMY1uoHlYftRM2LAwWKmBc4y3S8FvunpA4Ra1JYeVBk71S8N8tUiqGuVYAvBla_kL0hvhC4DpLhW-vSIpXaOx10-wHUCYf5IMswFWpSHfeW_k2p9TvOMi3gWn1ISg",
    },
    "refreshToken": {
      "token": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.P0b_zL4XtSbMaNnaca4KzO0ORw_ywCcTvmiGeK-xo4ekPCg3vsntP0jXBOiesjXB87vQFEkNj6pgIorIIrp7rvVmTu0nx29_xRpcFOJcMekLkfnwDY3wIXgLMbwgQJ4lyGb0fo_SEPE9PgPFazSyr_hGRjT41JcG1QNcjoo-QclL4ewRXXvRt7mS34I2-sDIBdon6qhC3fJ2nO5WLEnUSsSjeNMwqzTUWm-EXOKdC2H6xKpu3RJZrsAUdVRGTovJnXZ4EZhettpp9a37vut1rbUstAy8PdqjrwGiu3XkvemLjLfahBqdeEpBVUQZXITJZGSoFKsklmrWpOs99V1mqw.QbKpJBLCruPlqe0a.kS9D9E1mCYpFJfi_g26RMqLEtFEJDUFvLQGBpbmwZoNOK81bGtvPzNJWX4U0UBntzo1u3qodAkkgRSVdZLX-jkK2QxrXzfJ7-TA9coOmp77MIX9Y43-B3m4KaOFi4l_zi0e1JHRXatZDgG7-B-tvAChM1RQ3JrKBr_xsEKJagiUa4U-86WWO-07jGQsET6KCype-5wxzT3tLojy_pbhRNDtIlnMyPR2PQuQJCBIBt7G0fv0a5ly27joSbZTKe-XnLPDNZttiNsS40ac-dRMmtRwcdJXf5LfkpFOJ_Xtn3RaBkc3k7Roabq6r0lqWXIXry7RHVscR13TIWXHAdEBjQBdQg-W6vFWXO5EyjbNVrEZ5EKkhXZXIz9I1FhpU7vsyWyLbWBaPWVQWk25NxZYQZKQDd-WbGjX0Ky8udswDwzdTlzFw3r_v5WLmqpWXWlwKIwPVLNQNKKMA_DHXM1NhQyqgMVDsTH0jvKZpCvwcB6DORq0DvYmM8N10_fX6HE5Hn_8H1QWYEQ01slR3eUkQZ97wrjH7Yyz9x32I_vcJbdjnReQKVfCF2wZlr63cNIOHkwJTi6Er0wE4qa6l1GasaauUQH72iCE3JE4DTbbvKcLHADR-5A16dhHSyHcc2krXmeCGHCK1aWzq4IQRgSuAd1bkBxUHbNcV7RP1Ws5yoIS6_v5VyTzXJly74cH9nd1fnw36Gr6DUIJ9Z4KkWV8mWmpJFIueMwJElUcOCsks_QDw90PWXbiixd1tMLJLNQCKSc7wt4Mt40HbFXwxvXA_fZ9Oh_wjgr5AkgJB1lfaW2ShIXJzq0j0CMsvAiN7If5wEkqFRdoIQdGkAmJZ8-LPngH5f6ZMCstWkKPylULMHuEfjGzCUMrBSBwkmiqkmauouzq7QUDVLzM7asrz6zN1Wvs66taSfSIPDBa-X26uWwJRVCeEhj-A-vfvtjHEDj26UILC6V7yU_BWg27HgFEHiIjCn3TFPhNVpiYf_m9b2Scumf8nteEKjEh95X1_-tyfQ3b1RT8-YaeDu3X5sfKSWfoG9pCJDZHwgtPGsBNO5fqN4e0wHLp1tMpRRNvccjHOT6NRlBA3CH_JWxzyIZjAXGQlsKzyz5YFxEL3Wddmt6P5dU5a1lnTqe7lBmJdJXw2yCPugXKqoRie60apnBtRkhXJW0Dsrks-ZGw31i3DMC-53UUH_0YYpjTsPsaEvAO4FKRMQ9xff3fx0SuZBl2Ifrx4qS0xKRrYBWGI_Mrr8LYUoLflePLgG9MWCvMsVe1ZdZBvpsWIJzA.Qp-4UoLhljmbfCHQ4pcMGQ"
    },
    "accessToken": {
      "jwtToken": "eyJraWQiOiJcL1g3cUNMbk0yTHVhZFBheDBsYTAzbEZtdW9jcVRZNjRYUU5BMjhOK2ROcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3ZDk3Yzc4Ni04MGE0LTQxMmUtYWRkMy0zMTE0Y2Y0ZDI1ZmIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9xUFVrTDNVcEUiLCJjbGllbnRfaWQiOiIydnMyaWxtaTc3N2MzOW05czBhNWszc25hMiIsIm9yaWdpbl9qdGkiOiI1Y2IyZGIyMS03ZmI4LTQyNTEtYmU0NC01ZmE0MzU5YTE5NzkiLCJldmVudF9pZCI6ImE0NmFmMmYwLWVkZTQtNGNiMC05ODIzLTk5ODQ4MjE0MWYzNiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NzcyNjg2OTYsImV4cCI6MTY3NzI3MjI5NiwiaWF0IjoxNjc3MjY4Njk2LCJqdGkiOiIyZjY2ODY2Mi1mZmIyLTRlNDItOTQwMy1iZjk4ZmFkYzE3ZTAiLCJ1c2VybmFtZSI6InNoYXlhbmsifQ.N-F8fp-EEsatL6WJ4KTcphD1osj67TatXIsXkkgQl_iigKUhdxlTLbH9AIrXiPRvvVRtG0klMilKz7WRWvFohg-C6IpiYAJUQZAKXIbZYQgsfEGwR-GvRDfkb1koKL-KFxO_T2btyUbjAwUzD8sYOqeZugNb469R4iGckUq6hs17Y-JLmrc6MyfkjV_PDqhxdJhQbZPbSh7e2rmOwef8Ap1KqwikZ_s00n0F1lbFILHY3QabpMf5b5Ycz6MqJYzvkapAtZrlYkAP5TRofpabL3pZ-AsExzIN8huqcatUhhAxAzUKoLkfJng-fTxX-5koLd2IGrmEEZY-XWNzf6vlPg",
    },
    "clockDrift": 0
  }

  const authService = { 
    authenticateUser: () => cognitoUserSession,
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AuthModule,
      ],
    })
    .overrideProvider(AuthService)
    .useValue(authService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`POST /login`, () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        emailOrUsername: 'info@nexuus.com',
        password: 'p@sswo0rd!',
      })
      .expect(200)
      .expect(authService.authenticateUser());
  });

  afterAll(async () => {
    await app.close();
  });
});
