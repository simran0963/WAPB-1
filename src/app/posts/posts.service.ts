import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private http: HttpClient, private router: Router) {}
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://127.0.0.1:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((alteredPostData) => {
        this.posts = alteredPostData;
        this.postUpdated.next([...this.posts]);
      });
  }
  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content,
    };

    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((resp) => {
        post.id = resp.postId;
        // console.log(resp.postId);
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['']);
      });
  }
  getPostUpdatedListener() {
    return this.postUpdated.asObservable();
  }

  deletePost(id: string) {
    this.http.delete('http://localhost:3000/api/posts/' + id).subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id !== id);
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }
  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
    };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIdx = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostIdx] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
