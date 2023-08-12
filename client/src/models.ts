export interface IUser {
  _id: string;
  login: string;
  password: string;
  name?: string;
  email?: string;
  role: string;
  create_ts: number; // метка времени регистрации
  login_ts: number; // метка времени последнего логина
}

export interface IReport {
  _id: string;
  name: string;
  depart_id?: string; // принадлежность к отделу (не обязательно)
  is_public: boolean; // личный или для всех
  create_ts: number;
  create_user_id: string;
  change_ts: number;
  change_user_id: string;
  rate: number;
}

export interface IDepart {
  _id: string;
  code: string;
  name: string;
  color?: string;
}
