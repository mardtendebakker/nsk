import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setExactOnlineRefreshToken } from '../../../utils/storage';

export default function ExactOnlineOAuthCallback() {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (code && typeof code === 'string') {
      setExactOnlineRefreshToken(code);
      const returnUrl = sessionStorage.getItem('exactOnlineReturnUrl') || '/';
      sessionStorage.removeItem('exactOnlineReturnUrl');
      router.push(returnUrl);
    }
  }, [code, router]);

  return null;
}
