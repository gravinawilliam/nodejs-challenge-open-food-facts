export type HttpRequest<Body, Query, Parameters_> = {
  body: Body;
  query: Query;
  params: Parameters_;
  access_token: string;
};
