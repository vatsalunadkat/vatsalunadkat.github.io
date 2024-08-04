'use client';

import confetti from 'canvas-confetti';
import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
  cache,
} from 'react';

import { incrementCounter as incCounter } from '@/actions/counters';
import { useHasMounted } from '@/hooks/use-has-mounted';
import { useWindowDimensions } from '@/hooks/use-window-dimensions';
import type { ReactionName, Counters } from '@/types/db';

import { confettiOptions, reactionsSetup } from './reaction-button.config';

type ReactedLocalStorage = { [Key in ReactionName]?: boolean };

const incrementCounter = cache(incCounter);

export const useReactions = (slug: string, initialCounters?: Counters) => {
  const hasMounted = useHasMounted();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [submitting, setSubmitting] = useState<ReactionName | undefined>(
    undefined,
  );

  const [counters, setCounters] = useState<Counters>(initialCounters || {});
  const [reacted, setReacted] = useState<ReactedLocalStorage>({});

  useEffect(() => {
    if (!hasMounted) return;
    // Get if has reacted before (locally)
    const data = window.localStorage.getItem(slug);
    if (data) {
      try {
        const json = JSON.parse(data) as ReactedLocalStorage;
        setReacted(json);
      } catch (e) {}
    }
    // Cleanup confetti
    return () => {
      try {
        confetti.reset();
      } catch (e) {}
    };
  }, [hasMounted, slug]);

  const submitReaction = useCallback(
    async (reaction: ReactionName) => {
      // Do nothing in SSR or if a reaction has been already submitted
      if (!hasMounted || submitting || reacted[reaction]) return false;
      setSubmitting(reaction);
      let success = false;
      try {
        const newReactions = await incrementCounter(slug, reaction);
        if (Object.keys(newReactions).length) {
          setCounters((previousCounters) => ({
            ...previousCounters,
            ...newReactions,
          }));
          const newLsState: ReactedLocalStorage = {
            ...reacted,
            [reaction]: true,
          };
          window.localStorage.setItem(slug, JSON.stringify(newLsState));
          setReacted(newLsState);
          success = true;
        }
      } catch (e) {}
      setSubmitting(undefined);
      return success;
    },
    [hasMounted, submitting, reacted, slug],
  );

  const onButtonClick = async (
    event: MouseEvent<HTMLButtonElement>,
    reaction: ReactionName,
  ) => {
    const hostname = window.location.hostname || 'localhost';
    const shouldRecordReaction = hostname === 'jahir.dev';

    const reacted = shouldRecordReaction
      ? await submitReaction(reaction)
      : true;
    // If reaction was submitted successfully
    if (reacted) {
      const x = event.clientX / windowWidth;
      const y = event.clientY / windowHeight;
      confetti({
        ...confettiOptions,
        origin: { x, y },
        colors: [reactionsSetup[reaction].color],
      });
    }
  };

  return { onButtonClick, submitting, reacted, counters };
};
