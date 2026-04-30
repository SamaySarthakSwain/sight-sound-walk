-- 1. Add DELETE policy for search_history
CREATE POLICY "Users can delete their own search history"
ON public.search_history
FOR DELETE
USING (auth.uid() = user_id);

-- 2. Remove food_ratings from realtime publication to prevent broadcasting
-- all users' ratings (with user_id) to every authenticated subscriber.
ALTER PUBLICATION supabase_realtime DROP TABLE public.food_ratings;

-- 3. Revoke EXECUTE on handle_new_user from anon/authenticated.
-- This function is only intended to run via the on_auth_user_created trigger
-- as the table owner; signed-in users should not be able to call it directly.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;