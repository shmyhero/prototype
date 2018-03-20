using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace YJY_COMMON.Azure
{
    public class Blob
    {
        public static readonly string BLOB_BASE_URL = YJYGlobal.GetConfigurationSetting("StorageConnectionString") == null
            ? null
            : CloudStorageAccount.Parse(YJYGlobal.GetConfigurationSetting("StorageConnectionString")).BlobEndpoint.AbsoluteUri;

        public static string USER_PIC_BLOB_CONTAINER_NAME = "user-pic";
        public static string USER_PIC_FOLDER_URL = BLOB_BASE_URL + USER_PIC_BLOB_CONTAINER_NAME+ "/";
        public static string USER_DEFAULT_PIC_FOLDER_URL = USER_PIC_FOLDER_URL + "default/";
        public static List<string> USER_DEFAULT_PIC_FILENAMES = new List<string>()
        {
            "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg",
        };

        public static string GetRandomUserDefaultPicUrl()
        {
            var r = new Random();
            return USER_DEFAULT_PIC_FOLDER_URL + USER_DEFAULT_PIC_FILENAMES[r.Next(USER_DEFAULT_PIC_FILENAMES.Count)];
        }

        public static bool IsDefaultUserPic(string picUrl)
        {
            return picUrl.StartsWith(USER_DEFAULT_PIC_FOLDER_URL);
        }

        public static void UploadFromBytes(string containerName, string blobName, byte[] bytes)
        {
            var storageConStr = YJYGlobal.GetConfigurationSetting("StorageConnectionString");
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConStr);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Retrieve a reference to a container.
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);

            // Create the container if it doesn't already exist.
            container.CreateIfNotExists();
            container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

            // Retrieve reference to a blob named "myblob".
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobName);

            //// Save blob contents to a file.
            //using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
            //{
            //    blockBlob.DownloadToStream(fileStream);
            //}

            //// read blob contents as a string.
            //string text;
            //using (var memoryStream = new MemoryStream())
            //{
            //    blockBlob2.DownloadToStream(memoryStream);
            //    text = System.Text.Encoding.UTF8.GetString(memoryStream.ToArray());
            //}

            //// Create or overwrite the "myblob" blob with contents from a local file.
            //using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
            //{
            //    blockBlob.UploadFromStream(fileStream);
            //}

            //// Delete the blob.
            //blockBlob.Delete();

            blockBlob.UploadFromByteArray(bytes, 0, bytes.Length);
        }

        public static void DeleteBlob(string containerName, string blobName)
        {
            var storageConStr = YJYGlobal.GetConfigurationSetting("StorageConnectionString");
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConStr);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Retrieve a reference to a container.
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);

            CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobName);

            if (blockBlob.Exists())
            {
                blockBlob.Delete();
            }

        }
    }
}
