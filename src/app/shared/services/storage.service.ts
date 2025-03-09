import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  #storage = inject(Storage);

  constructor() {
    void this.#init();
  }

  public set<T>(key: string, value: T): Observable<T> {
    return from(this.#storage.set(key, value));
  }

  public get<T>(key: string): Observable<T | null> {
    return from(this.#storage.get(key));
  }

  public remove(key: string): Observable<void> {
    return from(this.#storage.remove(key));
  }

  public clear(): Observable<void> {
    return from(this.#storage.clear());
  }

  async #init() {
    await this.#storage.create();
  }
}
