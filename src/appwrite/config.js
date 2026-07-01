import conf from "../conf/conf";
import { Client, Databases, Storage, Query, ID } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ userId, caption, imageId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwritePostCollectionId,
        ID.unique(),
        { userId, caption, imageId }
      );
    } catch (error) {
      console.error("Appwrite Service :: createPost :: error", error);
      throw error;
    }
  }

  async updatePost(postId, { caption, imageId }) {
    try {
      const data = { caption };
      if (imageId) data.imageId = imageId;

      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwritePostCollectionId,
        postId,
        data
      );
    } catch (error) {
      console.error("Appwrite Service :: updatePost :: error", error);
      throw error;
    }
  }

  async deletePost(postId) {
  try {
    const post = await this.getPost(postId);

    // delete all likes of this post
    const likes = await this.getLikes(postId);
    await Promise.all(
      likes.documents.map((like) => this.unlikePost(like.$id))
    );

    // delete all comments of this post
    const comments = await this.getComments(postId);
    await Promise.all(
      comments.documents.map((comment) =>
        this.deleteComment(comment.$id)
      )
    );

    // delete image file
    if (post?.imageId) {
      await this.deleteFile(post.imageId);
    }

    // delete post document
    await this.databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwritePostCollectionId,
      postId
    );

    return true;
  } catch (error) {
    console.error("Appwrite Service :: deletePost :: error", error);
    throw error;
  }
}

  async getPost(postId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwritePostCollectionId,
        postId
      );
    } catch (error) {
      console.error("Appwrite Service :: getPost :: error", error);
      return null;
    }
  }

  async getPosts() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwritePostCollectionId,
        [Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Appwrite Service :: getPosts :: error", error);
      return { documents: [] };
    }
  }

  async getUserPosts(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwritePostCollectionId,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Appwrite Service :: getUserPosts :: error", error);
      return { documents: [] };
    }
  }

  async createProfile({ userId, name, email, avatarId = "", bio = "" }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProfileCollectionId,
        ID.unique(),
        { userId, name, email, avatarId, bio }
      );
    } catch (error) {
      console.error("Appwrite Service :: createProfile :: error", error);
      throw error;
    }
  }

  async getProfile(userId) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteProfileCollectionId,
        [Query.equal("userId", userId)]
      );

      return response.documents[0] || null;
    } catch (error) {
      console.error("Appwrite Service :: getProfile :: error", error);
      return null;
    }
  }

  async updateProfile(profileId, { name, bio, avatarId }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteProfileCollectionId,
        profileId,
        { name, bio, avatarId }
      );
    } catch (error) {
      console.error("Appwrite Service :: updateProfile :: error", error);
      throw error;
    }
  }

  async getLikes(postId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikeCollectionId,
        [Query.equal("postId", postId)]
      );
    } catch (error) {
      console.error("Appwrite Service :: getLikes :: error", error);
      return { documents: [] };
    }
  }

  async getUserLike(postId, userId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteLikeCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)]
      );
    } catch (error) {
      console.error("Appwrite Service :: getUserLike :: error", error);
      return { documents: [] };
    }
  }

  async likePost({ postId, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikeCollectionId,
        ID.unique(),
        { postId, userId }
      );
    } catch (error) {
      console.error("Appwrite Service :: likePost :: error", error);
      throw error;
    }
  }

  async unlikePost(likeId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikeCollectionId,
        likeId
      );

      return true;
    } catch (error) {
      console.error("Appwrite Service :: unlikePost :: error", error);
      throw error;
    }
  }

  async getComments(postId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCommentCollectionId,
        [Query.equal("postId", postId)]
      );
    } catch (error) {
      console.error("Appwrite Service :: getComments :: error", error);
      return { documents: [] };
    }
  }

  async createComment({ postId, userId, content }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentCollectionId,
        ID.unique(),
        { postId, userId, content }
      );
    } catch (error) {
      console.error("Appwrite Service :: createComment :: error", error);
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCommentCollectionId,
        commentId
      );

      return true;
    } catch (error) {
      console.error("Appwrite Service :: deleteComment :: error", error);
      throw error;
    }
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Appwrite Service :: uploadFile :: error", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite Service :: deleteFile :: error", error);
      throw error;
    }
  }

  getFileView(fileId) {
    return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();

export default service;