import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartsLoadingStatus, loadDepartsList } from '../../../store/departs';
import { getReportsLoadingStatus, loadReportsList } from '../../../store/reports';
import { getIsLoggedIn, getUsersLoadingStatus, loadUsersList } from '../../../store/users';
import LoadingAnim from '../loadingAnim';

const AppLoader = ({ children }) => {
  const isLoggedIn = useSelector(getIsLoggedIn());
  const isUsersLoading = useSelector(getUsersLoadingStatus());
  const isDepartsLoading = useSelector(getDepartsLoadingStatus());
  const isReportLoading = useSelector(getReportsLoadingStatus());
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

  if (isUsersLoading || isDepartsLoading || isReportLoading) {
    return <LoadingAnim />;
  }
  return children;
};

export default AppLoader;
