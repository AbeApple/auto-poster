import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../global/supabase/Client';
import { setUser, clearUser } from '../global/redux/slices/UserSlice';

const Initializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Initializer: Setting up auth state listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Initializer: Auth state changed', { event, hasSession: !!session });

        if (session?.user) {
          console.log('Initializer: User authenticated, setting user in Redux');
          dispatch(setUser(session.user));
        } else {
          console.log('Initializer: No user session, clearing user from Redux');
          dispatch(clearUser());
        }
      }
    );

    return () => {
      console.log('Initializer: Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [dispatch]);

  console.log('Initializer: Rendering children');
  return <>{children}</>;
};

export default Initializer;
