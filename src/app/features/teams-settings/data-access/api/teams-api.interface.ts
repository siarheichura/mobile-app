import { Observable } from 'rxjs';
import { TeamModel } from '../store/models/team.model';

export interface ITeamsApi {
  get(): Observable<TeamModel[] | null>;
  set(teams: TeamModel[]): Observable<void>;
  clear(): Observable<void>;
}
