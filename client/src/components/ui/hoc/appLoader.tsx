import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadDepartsList } from '../../../store/departs';
import { loadReportsList } from '../../../store/reports';
import { getIsLoggedIn, getUsersLoadingStatus, loadUsersList } from '../../../store/users';

const AppLoader = ({ children }) => {
  const isLoggedIn = useSelector(getIsLoggedIn());
  const isUsersLoading = useSelector(getUsersLoadingStatus());
  const dispatch: any = useDispatch();

  //console.log('AppLoader render');

  useEffect(() => {
    dispatch(loadDepartsList());
    dispatch(loadReportsList());
  }, []);

  useEffect(() => {
    //console.log('AppLoader isLoggedIn changed');
    if (isLoggedIn) {
      dispatch(loadUsersList());
    }
  }, [isLoggedIn]);

  if (isUsersLoading) {
    return 'Loading users....';
  }
  return children;
};

export default AppLoader;
