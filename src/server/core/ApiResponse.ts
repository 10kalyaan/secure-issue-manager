export class ApiResponse {
  static json<T>(data: T, init?: ResponseInit) {
    return Response.json(
      { success: true, data },
      { status: init?.status ?? 200, headers: init?.headers }
    );
  }
}
