import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from '@/integrations/posthog';

const PostHogPageviewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    posthog.capture('$pageview');
  }, [location.pathname, location.search]);

  return null;
};

export default PostHogPageviewTracker;
