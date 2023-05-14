import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


interface FileReference {
  originalname: string;
  filename: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private apiUrl = `${environment.API_URL}/api/files`;


  constructor(private http: HttpClient) { }

  getFile(name: string, url: string, fileType: string) {
    return this.http.get(url, { responseType: 'blob' })
      .pipe(
        tap(content => {
          const blob = new Blob([content], { type: fileType });
          saveAs(blob, name);
        }), map(() => true)
      );
  }

  uploadFile(file: Blob) {
    const dto = new FormData();
    dto.append('file', file);
    // return this.http.post<FileReference>(`${this.apiUrl}/upload`, dto, {
    //   headers: {
    //     'Content-type': "multipart/form-data"
    //   }
    // });
    return this.http.post<FileReference>(`${this.apiUrl}/upload`, dto);
  }
}
