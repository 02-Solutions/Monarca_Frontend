/* __tests__/utils/apiService.test.ts */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
} from '../../utils/apiService';

/* ═════════════ mock Axios (default) ═════════════ */
var axiosGet: Mock, axiosPost: Mock, axiosPut: Mock, axiosPatch: Mock, axiosDelete: Mock;
var respInterceptorError: any;

vi.mock('axios', () => {
  axiosGet    = vi.fn();
  axiosPost   = vi.fn();
  axiosPut    = vi.fn();
  axiosPatch  = vi.fn();
  axiosDelete = vi.fn();

  const use = vi.fn((_succ, err) => {
    respInterceptorError = err; // guardamos sólo el handler que usamos
  });

  const instance = {
    get: axiosGet,
    post: axiosPost,
    put: axiosPut,
    patch: axiosPatch,
    delete: axiosDelete,
    interceptors: { response: { use } },
  };

  const create = vi.fn(() => instance);

  return { default: { create, ...instance }, create, ...instance };
});

/* ═════════════ dummy data ═════════════ */
const dummyData = { ok: true };

/* ═════════════ tests ═════════════ */
describe('apiService – cobertura completa', () => {
  beforeEach(() => vi.clearAllMocks());

  /* ---------- GET ---------- */
  it('getRequest devuelve datos', async () => {
    axiosGet.mockResolvedValueOnce({ data: dummyData });
    const data = await getRequest('/foo', { q: 1 });
    expect(axiosGet).toHaveBeenCalledWith('/foo', { params: { q: 1 } });
    expect(data).toEqual(dummyData);
  });

  /* ---------- POST ---------- */
  it('postRequest JSON vs FormData', async () => {
    axiosPost.mockResolvedValue({ data: dummyData });

    await postRequest('/json', { a: 1 });
    const fd = new FormData(); fd.append('f', '1');
    await postRequest('/form', fd);

    const cfgJson = (axiosPost.mock.calls[0] as any[])[2];
    const cfgForm = (axiosPost.mock.calls[1] as any[])[2];

    expect(cfgJson.headers?.['Content-Type']).toBeUndefined();
    expect(cfgForm.headers?.['Content-Type']).toBe('multipart/form-data');
  });

  it('postRequest propaga errores', async () => {
    axiosPost.mockRejectedValueOnce(new Error('boom'));
    await expect(postRequest('/fail', {})).rejects.toThrow('boom');
  });

  /* ---------- PUT ---------- */
  it('putRequest JSON vs FormData', async () => {
    axiosPut.mockResolvedValue({ data: dummyData });

    await putRequest('/json', { a: 1 });
    const fd = new FormData(); fd.append('x', '1');
    await putRequest('/form', fd);

    const cfgJson = (axiosPut.mock.calls[0] as any[])[2];
    const cfgForm = (axiosPut.mock.calls[1] as any[])[2];

    expect(cfgJson.headers?.['Content-Type']).toBeUndefined();
    expect(cfgForm.headers?.['Content-Type']).toBe('multipart/form-data');
  });

  /* ---------- PATCH ---------- */
  it('patchRequest JSON vs FormData', async () => {
    axiosPatch.mockResolvedValue({ data: dummyData });

    await patchRequest('/json', { a: 1 });
    const fd = new FormData(); fd.append('y', '1');
    await patchRequest('/form', fd);

    const cfgJson = (axiosPatch.mock.calls[0] as any[])[2];
    const cfgForm = (axiosPatch.mock.calls[1] as any[])[2];

    expect(cfgJson.headers?.['Content-Type']).toBeUndefined();
    expect(cfgForm.headers?.['Content-Type']).toBe('multipart/form-data');
  });

  it('patchRequest propaga errores', async () => {
    axiosPatch.mockRejectedValueOnce(new Error('bad'));
    await expect(patchRequest('/bad', {})).rejects.toThrow('bad');
  });

  /* ---------- DELETE ---------- */
  it('deleteRequest éxito y error', async () => {
    axiosDelete.mockResolvedValueOnce({ data: dummyData });
    const data = await deleteRequest('/del/1');
    expect(data).toEqual(dummyData);

    axiosDelete.mockRejectedValueOnce(new Error('fail'));
    await expect(deleteRequest('/del/2')).rejects.toThrow('fail');
  });

  /* ---------- Interceptor ---------- */
  it('interceptor propaga cualquier error', async () => {
    await expect(respInterceptorError({ response: { status: 401 } })).rejects.toBeDefined();
    await expect(respInterceptorError({ request: {} })).rejects.toBeDefined();
    await expect(respInterceptorError({ message: 'boom' })).rejects.toBeDefined();
  });
});
