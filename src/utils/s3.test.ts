import { clearAllObjects, getObject as getS3Object } from './s3';

jest.mock('aws-sdk', () => {
  const listObjectsV2Value = { promise: jest.fn() };
  const listObjectsV2 = jest.fn(() => listObjectsV2Value);
  const getObjectValue = { promise: jest.fn() };
  const getObject = jest.fn(() => getObjectValue);
  const deleteObjectsValue = { promise: jest.fn() };
  const deleteObjects = jest.fn(() => deleteObjectsValue);
  const S3 = jest.fn(() => ({ listObjectsV2, getObject, deleteObjects }));
  return { S3 };
});

describe('s3 utils', () => {
  const AWS = require('aws-sdk');
  const s3 = AWS.S3;

  const [region, bucket] = ['region', 'bucket'];

  describe('clearAllObjects', () => {
    test('should not call deleteObjects on empty bucket', async () => {
      const listObjectsV2 = s3().listObjectsV2;
      const deleteObjects = s3().deleteObjects;
      const promise = listObjectsV2().promise;
      promise.mockReturnValue(Promise.resolve({ Contents: undefined }));

      jest.clearAllMocks();

      await clearAllObjects(region, bucket);

      expect(s3).toHaveBeenCalledTimes(1);
      expect(s3).toHaveBeenCalledWith({ region });
      expect(listObjectsV2).toHaveBeenCalledTimes(1);
      expect(listObjectsV2).toHaveBeenCalledWith({
        Bucket: bucket,
        ContinuationToken: undefined,
      });
      expect(deleteObjects).toHaveBeenCalledTimes(0);
    });

    test('should call deleteObjects on non empty bucket', async () => {
      const listObjectsV2 = s3().listObjectsV2;
      const deleteObjects = s3().deleteObjects;
      const promise = listObjectsV2().promise;
      const firstItems = ['key1', 'key2'].map(Key => ({ Key }));
      const nextContinuationToken = 'NextContinuationToken';
      promise.mockReturnValueOnce(
        Promise.resolve({
          Contents: firstItems,
          IsTruncated: true,
          NextContinuationToken: nextContinuationToken,
        }),
      );
      const secondItems = ['key3', ''].map(Key => ({ Key }));
      promise.mockReturnValueOnce(
        Promise.resolve({ Contents: secondItems, IsTruncated: false }),
      );

      jest.clearAllMocks();

      await clearAllObjects(region, bucket);

      expect(s3).toHaveBeenCalledTimes(3);
      expect(s3).toHaveBeenCalledWith({ region });
      expect(listObjectsV2).toHaveBeenCalledTimes(2);
      expect(listObjectsV2).toHaveBeenCalledWith({
        Bucket: bucket,
        ContinuationToken: undefined,
      });
      expect(listObjectsV2).toHaveBeenCalledWith({
        Bucket: bucket,
        ContinuationToken: nextContinuationToken,
      });
      expect(deleteObjects).toHaveBeenCalledTimes(1);
      expect(deleteObjects).toHaveBeenCalledWith({
        Bucket: bucket,
        Delete: {
          Objects: [...firstItems, ...secondItems],
          Quiet: false,
        },
      });
    });

    test('should call listObjectsV2 with prefix', async () => {
      const listObjectsV2 = s3().listObjectsV2;
      const promise = listObjectsV2().promise;
      const items = ['key1', 'key2'].map(Key => ({ Key }));
      promise.mockReturnValueOnce(
        Promise.resolve({
          Contents: items,
        }),
      );

      jest.clearAllMocks();

      const prefix = 'prefix';
      await clearAllObjects(region, bucket, prefix);

      expect(listObjectsV2).toHaveBeenCalledTimes(1);
      expect(listObjectsV2).toHaveBeenCalledWith({
        Bucket: bucket,
        ContinuationToken: undefined,
        Prefix: prefix,
      });
    });
  });

  describe('getObject', () => {
    test('should return buffer on existing object', async () => {
      const getObject = s3().getObject;
      const promise = getObject().promise;

      const expectedBuffer = Buffer.from('some data');
      promise.mockReturnValue(Promise.resolve({ Body: expectedBuffer }));

      jest.clearAllMocks();

      const key = 'key';
      const { body: actualBuffer, found } = await getS3Object(
        region,
        bucket,
        key,
      );

      expect(s3).toHaveBeenCalledTimes(1);
      expect(s3).toHaveBeenCalledWith({ region });
      expect(getObject).toHaveBeenCalledTimes(1);
      expect(getObject).toHaveBeenCalledWith({ Bucket: bucket, Key: key });

      expect(found).toBeTruthy();
      expect(actualBuffer).toEqual(expectedBuffer);
    });

    class ErrorWithCode extends Error {
      public code: string;

      constructor(props: any) {
        super(props);
        this.code = props.code;
      }
    }

    test('should return found === false on non existing item', async () => {
      const getObject = s3().getObject;
      const promise = getObject().promise;

      promise.mockReturnValue(
        Promise.reject(new ErrorWithCode({ code: 'NoSuchKey' })),
      );

      jest.clearAllMocks();

      const key = 'key';
      const { body, found } = await getS3Object(region, bucket, key);

      expect(found).toBeFalsy();
      expect(body).toEqual(null);
    });

    test('should throw error on unknown error', async () => {
      const getObject = s3().getObject;
      const promise = getObject().promise;

      const error = new ErrorWithCode({ code: 'SomeUnknownError' });
      promise.mockReturnValue(Promise.reject(error));

      jest.clearAllMocks();

      expect.assertions(1);
      const key = 'key';
      await expect(getS3Object(region, bucket, key)).rejects.toBe(error);
    });
  });
});
