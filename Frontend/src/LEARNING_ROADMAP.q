╔══════════════════════════════════════════════════════════════════════════╗
║         JOB PORTAL — COMPLETE LEARNING ROADMAP (BEGINNER → PRO)         ║
╚══════════════════════════════════════════════════════════════════════════╝

IMPORTANT NOTE BEFORE YOU START
────────────────────────────────
This project uses RTK Query (NOT TanStack Query).
They solve the same problem but differently.

  TanStack Query  → standalone library, works with any state manager
  RTK Query       → built INTO Redux Toolkit, cache lives in Redux store

Learn ONE first. Since this project uses Redux anyway, RTK Query makes
more sense here. Once you understand RTK Query, TanStack Query will take
you 1 day to pick up — the concepts are identical.

DO NOT try to learn both at the same time. Pick RTK Query for this project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 1 — JAVASCRIPT FUNDAMENTALS (Skip if comfortable)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before touching React or Redux, make sure you know:

  1. async / await and Promises
     → Every API call in this project uses async/await
     → File to look at: src/pages/auth/Login.tsx → handleSubmit()

  2. Destructuring
     → const { user, isAuthenticated } = useAuth()
     → Used everywhere in this project

  3. Spread operator
     → { ...form, userEmail: e.target.value }
     → Used in every form's onChange handler

  4. Array methods: .map() .filter() .find() .reduce()
     → Used heavily in BrowseJobs.tsx (filtering jobs)
     → Used in StudentDashboard.tsx (counting stats)

  5. Optional chaining (?.) and nullish coalescing (??)
     → user?.userName ?? "U"
     → Used in almost every file

  If any of these feel unclear, stop and learn them first.
  Everything else builds on top of these.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 2 — TYPESCRIPT BASICS (Just enough for this project)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You don't need to master TypeScript. Learn just these:

  1. Interfaces
     → File: src/types/index.ts
     → This is the FIRST file to read in the project
     → It defines User, Job, Company, Application shapes
     → Everything else refers back to this file

  2. Type annotations on function parameters
     → (e: React.FormEvent) => ...
     → ({ id, status }: { id: string; status: Status }) => ...

  3. Generics (the <T> angle bracket syntax)
     → builder.query<{ jobs: Job[] }, void>
     → First type = what the API returns
     → Second type = what argument the query takes

  4. "as const" and union types
     → "student" | "recruiter"
     → Used in authSlice.ts and route guards

  File to start: src/types/index.ts
  Read this file first before any other file in the project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 3 — REACT FUNDAMENTALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Learn these React concepts in this order:

  STEP 1 — useState
  ─────────────────
  What it does: stores local component data
  Where used:   Login.tsx → form state (email, password, role)
                BrowseJobs.tsx → search, filters
                MyCompanies.tsx → newName, editingId, editForm

  Read: src/pages/auth/Login.tsx
  Focus on: const [form, setForm] = useState({...})
            const [showPass, setShowPass] = useState(false)

  STEP 2 — useEffect
  ──────────────────
  What it does: runs code after render / when dependencies change
  Where used:   src/hooks/index.ts → useDebounce (the timer logic)
                src/App.tsx → the 401 event listener

  Read: src/hooks/index.ts → useDebounce function
  This is the clearest useEffect example in the project.

  STEP 3 — useMemo
  ────────────────
  What it does: caches a computed value, only recalculates when
                dependencies change. Prevents expensive recalculation
                on every render.
  Where used:   BrowseJobs.tsx → filteredJobs (filters the job list)
                StudentDashboard.tsx → stats (counts pending/accepted)
                RecruiterDashboard.tsx → myJobs, myCompanyIds

  Read: src/pages/student/BrowseJobs.tsx → filteredJobs useMemo
  This is why search feels instant — filtering happens on cached
  data, not a new API call.

  STEP 4 — React.memo
  ───────────────────
  What it does: prevents a component from re-rendering if its
                props haven't changed
  Where used:   src/components/ui/index.tsx
                JobCard, CompanyCard, StatCard, ApplicationRow
                are all wrapped in memo()

  Why it matters at scale:
  Without memo → every parent re-render re-renders ALL job cards
  With memo    → only the card whose props changed re-renders

  STEP 5 — React.lazy + Suspense
  ───────────────────────────────
  What it does: splits your app into chunks, loads pages on demand
  Where used:   src/App.tsx → every page is lazy loaded

  const Login = lazy(() => import("./pages/auth/Login"))

  Without lazy → entire app JS downloads on first load (~500KB)
  With lazy    → only Login.tsx downloads first (~30KB)
                 StudentDashboard downloads only when student logs in

  Read: src/App.tsx → top section with all the lazy() imports

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 4 — REDUX TOOLKIT (RTK) — THE STATE MANAGER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Redux has 3 core concepts. Learn them in this order:

  CONCEPT 1 — The Store (the single source of truth)
  ───────────────────────────────────────────────────
  File: src/store/index.ts

  Think of the store as a big JavaScript object that every
  component in the app can read from.

  store = {
    auth: { user, isAuthenticated, role },
    ui:   { sidebarOpen, searchQuery, jobFilters },
    api:  { ... RTK Query cache lives here ... }
  }

  CONCEPT 2 — Slices (how you define state + actions)
  ────────────────────────────────────────────────────
  File: src/store/slices/authSlice.ts  ← READ THIS FIRST
  File: src/store/slices/uiSlice.ts    ← simpler, read second

  A slice has:
    - initialState: the starting value
    - reducers: functions that change the state

  authSlice has 3 reducers:
    setUser(user)    → called after login/register
    clearUser()      → called on logout or 401
    updateUser(data) → called after profile update

  CONCEPT 3 — Dispatch + useSelector (how components talk to store)
  ──────────────────────────────────────────────────────────────────
  File: src/hooks/index.ts → useAuth, useAppDispatch, useAppSelector

  Reading from store:
    const { user, isAuthenticated } = useAuth()
    ← this reads from store.auth

  Writing to store:
    const dispatch = useAppDispatch()
    dispatch(setUser(responseUser))
    ← this calls the setUser reducer

  File to trace this full flow:
    src/pages/auth/Login.tsx → handleSubmit()
    1. login() fires API call
    2. dispatch(setUser(res.user)) saves to Redux
    3. localStorage.setItem() in authSlice persists it
    4. navigate() sends to dashboard

  IMPORTANT: localStorage persistence
  ─────────────────────────────────────
  Look at authSlice.ts → initialState:

    const savedUser = localStorage.getItem("user")
    const initialState = {
      user: savedUser ? JSON.parse(savedUser) : null,
      isAuthenticated: !!savedUser,
    }

  This runs when the app boots. If localStorage has a user,
  Redux starts as already-logged-in. This is why page refresh
  doesn't log you out.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 5 — RTK QUERY (THE MOST IMPORTANT PART)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RTK Query handles ALL server communication in this project.
No useEffect + fetch. No manual loading states. It does it all.

  WHAT RTK QUERY GIVES YOU FOR FREE:
  ────────────────────────────────────
  ✅ Automatic loading / error / success states
  ✅ Caching — same query returns cached data instantly
  ✅ Deduplication — 10 components, 1 HTTP request
  ✅ Background refetch — stale data refreshes silently
  ✅ Cache invalidation — mutation fires → related queries refetch

  STEP 1 — Understand the root API
  ──────────────────────────────────
  File: src/api/baseApi.ts

  This creates ONE api object. All other api files inject
  their endpoints INTO this one object. This is why you can
  do surgical cache invalidation across different files —
  they all share the same cache.

  tagTypes declared here = every possible cache key in the app.

  STEP 2 — Understand a query endpoint
  ──────────────────────────────────────
  File: src/api/jobApi.ts → getAllJobs

  getAllJobs: builder.query<{ jobs: Job[] }, void>({
    query: () => ({ url: "/job/all-jobs" }),
    providesTags: [{ type: "Jobs", id: "LIST" }],
    keepUnusedDataFor: 60,
  })

  Read this as:
    - Hit GET /job/all-jobs
    - Cache the result under tag "Jobs:LIST"
    - Keep that cache for 60 seconds
    - Return type is { jobs: Job[] }
    - Takes no argument (void)

  In a component:
    const { data, isLoading } = useGetAllJobsQuery()

  That's it. No useEffect. No useState for loading.
  RTK Query handles all of it.

  STEP 3 — Understand a mutation endpoint
  ─────────────────────────────────────────
  File: src/api/authApi.ts → login

  login: builder.mutation<{ user: User }, LoginPayload>({
    query: (credentials) => ({
      url: "/user/login-user",
      method: "POST",
      data: credentials,
    }),
    invalidatesTags: ["User"],
  })

  In a component:
    const [login, { isLoading }] = useLoginMutation()
    const result = await login({ userEmail, userPassword, userRole }).unwrap()

  .unwrap() → throws an error if the request fails
           → lets you use try/catch cleanly

  STEP 4 — Understand cache tags (THE KEY CONCEPT)
  ──────────────────────────────────────────────────
  This is what confused you. Read this carefully.

  providesTags   → "I am caching data under this label"
  invalidatesTags → "Please delete cache with this label"

  When they match → RTK Query automatically refetches.
  When they don't match → nothing refetches. (This was our bug!)

  Example from the bug we fixed:

    BROKEN:
      getCompaniesByRecruiter → providesTags: "recruiter-abc123"
      createCompany           → invalidatesTags: "LIST"
      Result: tags don't match → list never refetches

    FIXED:
      getCompaniesByRecruiter → providesTags: "recruiter-abc123"
      createCompany           → invalidatesTags: "recruiter-abc123" ✅
      Result: tags match → list refetches automatically

  RULE: Whatever string you put in providesTags, you MUST put
        the exact same string in invalidatesTags.

  STEP 5 — Trace a full data flow
  ────────────────────────────────
  Follow this exact sequence through the code:

  Student applies for a job:

  1. src/pages/student/BrowseJobs.tsx
     → user clicks "Apply Now"
     → handleApply(job._id) called

  2. useApplyJobMutation() fires
     → POST /application/apply-job/:jobId
     → File: src/api/applicationApi.ts → applyJob

  3. Server responds 201
     → invalidatesTags: [{ type: "Applications", id: "LIST" }]

  4. useGetAppliedJobsQuery() sees its tag "Applications:LIST" invalidated
     → automatically refetches GET /application/applied-jobs
     → File: src/api/applicationApi.ts → getAppliedJobs

  5. AppliedJobs page next time user visits = shows new application
     → No manual refetch. No page reload. Zero code needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 6 — ROUTING & SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  File: src/routes/Guards.tsx

  3 guards, read in this order:

  1. PublicOnlyRoute
     If logged in → redirect to dashboard
     If not → show the page (Login, Register)

  2. ProtectedRoute
     If not logged in → redirect to /login
     Saves the attempted URL in location.state
     After login → lands on the page they wanted

  3. RoleRoute
     If logged in but wrong role → redirect to own dashboard
     Student visiting /recruiter/* → bounced to /student/dashboard
     Recruiter visiting /student/* → bounced to /recruiter/dashboard

  File: src/App.tsx
  See how the guards nest inside each other:

    <PublicOnlyRoute>          ← logged-out only
      <Login />
    </PublicOnlyRoute>

    <ProtectedRoute>           ← must be logged in
      <DashboardLayout>
        <RoleRoute allowed="student">   ← must be student
          <StudentDashboard />
        </RoleRoute>
        <RoleRoute allowed="recruiter"> ← must be recruiter
          <RecruiterDashboard />
        </RoleRoute>
      </DashboardLayout>
    </ProtectedRoute>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PHASE 7 — AXIOS & THE 401 INTERCEPTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  File: src/api/axiosInstance.ts

  One axios instance is created. RTK Query uses it for
  every single API call in the app.

  withCredentials: true
  → Sends the httpOnly JWT cookie on every request automatically
  → You never manually attach tokens. The browser does it.

  The 401 interceptor:
  → If ANY API call returns 401 (token expired)
  → Fires a CustomEvent("auth:unauthorized")
  → App.tsx listens for this event → dispatch(clearUser())
  → User is logged out automatically from anywhere in the app

  Why CustomEvent instead of importing the store directly?
  → Importing store into axiosInstance would create a circular
    dependency: store → api → axiosInstance → store
  → CustomEvent breaks the circle cleanly

  File: src/App.tsx → useEffect at the top
  This is where the event is caught.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 READ ORDER — EXACT FILE + EXACT CODE TO FOCUS ON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Each entry tells you:
    FILE        → which file to open
    READ THIS   → the exact lines / functions to study
    SKIP THIS   → what to ignore on first read
    UNDERSTAND  → the one idea to take away from this file

──────────────────────────────────────────────────────────────────────
 01. src/types/index.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The entire file. It's small (~60 lines).
    Focus on the User, Job, Company, Application interfaces.

  UNDERSTAND:
    This is the dictionary of the whole project.
    Every other file speaks this language.
    Before reading any other file, know what a "Job" looks like:

      interface Job {
        _id: string
        title: string
        company: Company   ← a nested object, not just an ID
        requirements: string[]
        salary: number
        ...
      }

    When you see job.company.companyName anywhere in the project,
    you will know exactly why that works — because company is a
    full object, not just a string ID (because of .populate()).

  SKIP THIS:
    Nothing. Read all of it.

──────────────────────────────────────────────────────────────────────
 02. src/api/axiosInstance.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    Line: withCredentials: true
    Line: timeout: 15000
    The response interceptor block (the if 401 part)

  UNDERSTAND:
    withCredentials: true means the browser automatically sends
    the httpOnly JWT cookie on every request. You never write
    headers: { Authorization: "Bearer ..." } anywhere.
    The browser does it silently.

    The 401 interceptor:
      if (error.response?.status === 401) {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"))
      }
    This fires an event. App.tsx catches it and logs the user out.
    This is how a token expiry is handled globally without touching
    every single API call individually.

  SKIP THIS:
    The request interceptor. It's empty for now, just a placeholder.

──────────────────────────────────────────────────────────────────────
 03. src/api/baseApi.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The axiosBaseQuery function (lines 20-38)
    The rootApi createApi call (lines 41-55)
    The tagTypes array

  UNDERSTAND:
    axiosBaseQuery is a bridge. RTK Query wants to use its own
    fetch, but we need axios so our interceptors work.
    This function makes RTK Query use axios instead.

    tagTypes is the master list of every cache label in the app:
      tagTypes: ["User", "Jobs", "Job", "Companies", "Company",
                 "Applications", "Applicants"]

    Think of these as folder names. Queries store data IN folders.
    Mutations delete folders. When a folder is deleted, the query
    that owns it refetches automatically.

  SKIP THIS:
    The TypeScript generic types on axiosBaseQuery. Too complex
    for now. Just know it makes RTK Query use axios.

──────────────────────────────────────────────────────────────────────
 04. src/api/authApi.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The login mutation — start here, it's the simplest one.
    Then the logout mutation.

  UNDERSTAND:
    A mutation looks like this:

      login: builder.mutation<RETURN_TYPE, INPUT_TYPE>({
        query: (credentials) => ({
          url: "/user/login-user",
          method: "POST",
          data: credentials,
        }),
        invalidatesTags: ["User"],
      })

    RETURN_TYPE = { message: string; success: boolean; user: User }
    INPUT_TYPE  = { userEmail, userPassword, userRole }

    invalidatesTags: ["User"] means:
      "After this mutation succeeds, delete the User cache entry
       so any component reading user data gets fresh data."

    In a component you use it like:
      const [login, { isLoading }] = useLoginMutation()
      const result = await login({ userEmail, userPassword, userRole }).unwrap()

  SKIP THIS:
    updateProfile mutation on first read. Come back to it after
    you understand Login.tsx.

──────────────────────────────────────────────────────────────────────
 05. src/store/slices/authSlice.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The initialState block at the top (lines 16-21)
    The setUser reducer
    The clearUser reducer

  UNDERSTAND:
    The initialState runs once when the app starts:

      const savedUser = localStorage.getItem("user")
      const initialState = {
        user: savedUser ? JSON.parse(savedUser) : null,
        isAuthenticated: !!savedUser,
        role: savedUser ? JSON.parse(savedUser).userRole : null,
      }

    If localStorage has a user → app starts logged in.
    If not → app starts logged out.
    This is literally the entire "stay logged in after refresh" logic.

    setUser:
      Saves user to Redux state AND to localStorage.
      Called from Login.tsx after successful login.

    clearUser:
      Removes user from Redux AND localStorage.
      Called from Navbar logout button AND from 401 interceptor.

  SKIP THIS:
    updateUser on first read. It's just a partial update, same idea.

──────────────────────────────────────────────────────────────────────
 06. src/store/slices/uiSlice.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The whole file. It's tiny (~40 lines).

  UNDERSTAND:
    This is a simple slice with no async logic.
    toggleSidebar, setSearchQuery, setJobFilters.
    This is the easiest slice to read — good for understanding
    how reducers work before tackling authSlice.

    Actually read this BEFORE authSlice if Redux is new to you.
    It has zero complexity, pure state changes only.

  SKIP THIS:
    Nothing. It's short.

──────────────────────────────────────────────────────────────────────
 07. src/store/index.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The configureStore call.
    The reducer object inside it.

  UNDERSTAND:
    This is where all the slices and RTK Query come together:

      configureStore({
        reducer: {
          auth: authReducer,          ← your login/logout state
          ui:   uiReducer,            ← your sidebar/filter state
          [rootApi.reducerPath]: rootApi.reducer  ← ALL cached API data
        },
        middleware: (get) => get().concat(rootApi.middleware)
      })

    The rootApi.middleware line is critical.
    Without it, caching, refetching, and invalidation all stop working.
    Always include it. No exceptions.

    RootState and AppDispatch are exported here so every useSelector
    and useDispatch call in the app is fully typed.

  SKIP THIS:
    Nothing to skip. The file is 25 lines total.

──────────────────────────────────────────────────────────────────────
 08. src/hooks/index.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    useAppDispatch and useAppSelector (first 6 lines after imports)
    useAuth
    useDebounce

  UNDERSTAND:
    useAuth is just:
      () => useAppSelector((state) => state.auth)

    That's it. It reads the auth slice from Redux.
    Every component that needs the logged-in user calls useAuth().

    useDebounce:
      const [debounced, setDebounced] = useState(value)
      useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)  ← this is the cleanup
      }, [value, delay])

    Every time value changes, a 400ms timer starts.
    If value changes again before 400ms, the timer resets.
    Only after 400ms of no change does debounced update.
    This means search only filters after you STOP typing.

  SKIP THIS:
    usePrevious and useClickOutside on first read.
    They're utility hooks, not used in critical paths.

──────────────────────────────────────────────────────────────────────
 09. src/routes/Guards.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    All 3 guards. The file is ~40 lines total.

  UNDERSTAND:
    Each guard is just an if-statement wrapped in a component:

    ProtectedRoute:
      if (!isAuthenticated) return <Navigate to="/login" />
      return <Outlet />   ← Outlet renders the child route

    RoleRoute:
      if (role !== allowed) return <Navigate to="their dashboard" />
      return <Outlet />

    The Outlet is the key React Router concept here.
    When you nest routes, Outlet is the placeholder where the
    child route renders. Think of it as {children} but for routes.

    Guards are COMPOSABLE. In App.tsx you nest them:
      ProtectedRoute → RoleRoute → ActualPage
    The user passes through each guard in order.
    If they fail any guard → immediate redirect, page never loads.

  SKIP THIS:
    Nothing. This is critical to understand.

──────────────────────────────────────────────────────────────────────
 10. src/main.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The entire file. It's 15 lines.

  UNDERSTAND:
    createRoot(document.getElementById("root")).render(...)
    This is React 18's way of starting the app.

    Provider store={store} wraps everything.
    This makes the Redux store available to every component
    in the tree. Without Provider, useSelector and useDispatch
    throw errors.

  SKIP THIS:
    Nothing. Read all of it.

──────────────────────────────────────────────────────────────────────
 11. src/App.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    1. The lazy() imports at the top — all 10 of them
    2. The useEffect with the auth:unauthorized listener
    3. The Routes structure — focus on how guards nest

  UNDERSTAND:
    Lazy imports:
      const Login = lazy(() => import("./pages/auth/Login"))
    This means Login.tsx is NOT included in the initial bundle.
    It downloads only when the user navigates to /login.

    The route nesting in JSX:
      <ProtectedRoute>         ← must be logged in
        <DashboardLayout>      ← renders Navbar + Sidebar
          <RoleRoute allowed="student">   ← must be student
            <StudentDashboard />
          </RoleRoute>
        </DashboardLayout>
      </ProtectedRoute>

    Read this nesting carefully. This is the entire security
    model of the frontend in ~30 lines of JSX.

  SKIP THIS:
    The Toaster config. It's just styling for toast notifications.

──────────────────────────────────────────────────────────────────────
 12. src/pages/auth/Login.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The handleSubmit function — this is the most important part.
    The role toggle buttons (the two-button switcher).

  UNDERSTAND:
    handleSubmit is the complete login flow in one function:

      const handleSubmit = async (e) => {
        e.preventDefault()

        // 1. Call the API via RTK Query mutation
        const res = await login(form).unwrap()

        // 2. Save user to Redux + localStorage
        dispatch(setUser(res.user))

        // 3. Navigate to their dashboard
        navigate(from ?? (role === "recruiter" ? "/recruiter/dashboard" : "/student/dashboard"))
      }

    from comes from location.state.from — it's the page they
    tried to visit before being redirected to login.
    After login, they go back to where they wanted to be.

    .unwrap() makes the mutation throw on error, so the catch
    block handles the error toast cleanly.

  SKIP THIS:
    The JSX/styling. Focus on the logic functions first.
    Come back to the JSX after you understand the logic.

──────────────────────────────────────────────────────────────────────
 13. src/pages/auth/Register.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    handleSubmit — specifically the auto-login after register part.

  UNDERSTAND:
    After register succeeds, it immediately calls login:

      await register(form).unwrap()
      const loginRes = await login({ email, password, role }).unwrap()
      dispatch(setUser(loginRes.user))

    Two API calls in sequence. If register succeeds but login fails,
    the catch handles it. This is clean async/await chaining.

  SKIP THIS:
    The field() helper function. It's just a shorthand for
    rendering input fields. Cosmetic utility, not important logic.

──────────────────────────────────────────────────────────────────────
 14. src/api/jobApi.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    getAllJobs query — the most complete example of a query.
    updateJob mutation — example of surgical tag invalidation.

  UNDERSTAND:
    getAllJobs has this providesTags pattern:

      providesTags: (result) =>
        result
          ? [
              ...result.jobs.map(({ _id }) => ({ type: "Job", id: _id })),
              { type: "Jobs", id: "LIST" },
            ]
          : [{ type: "Jobs", id: "LIST" }]

    This stores BOTH:
      - A tag for each individual job: { type: "Job", id: "abc123" }
      - A tag for the whole list: { type: "Jobs", id: "LIST" }

    Why? So that updateJob can invalidate just ONE job:
      invalidatesTags: [{ type: "Job", id: jobId }]
    Without touching the list cache or other jobs.
    That is surgical invalidation.

    keepUnusedDataFor: 60
    If you leave the page and come back within 60 seconds,
    no HTTP request is made. The cached data is returned instantly.

  SKIP THIS:
    getJobsByCompany on first read. Same pattern as getAllJobs.

──────────────────────────────────────────────────────────────────────
 15. src/pages/student/BrowseJobs.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The useDebounce usage at the top.
    The filteredJobs useMemo block.
    The appliedJobIds useMemo (the Set).
    The handleApply function.

  UNDERSTAND:
    This page shows everything working together:

    1. useDebounce(search, 400)
       User types "React" → after 400ms → debouncedSearch = "React"
       filteredJobs recomputes only then, not on every keystroke.

    2. filteredJobs useMemo
       const filteredJobs = useMemo(() => {
         return (data?.jobs ?? []).filter((job) => {
           const matchSearch = job.title.toLowerCase().includes(q)
           const matchLocation = job.location.toLowerCase().includes(loc)
           return matchSearch && matchLocation
         })
       }, [data, debouncedSearch, debouncedLocation, jobType])

       The filtering runs on the CACHED data from RTK Query.
       Zero extra API calls. Just JavaScript array filtering.

    3. appliedJobIds = new Set(...)
       A Set gives O(1) lookup. Instead of:
         appliedJobs.find(a => a.job._id === job._id)  ← O(n) every render
       You do:
         appliedJobIds.has(job._id)  ← O(1) every render
       At 1000 job cards this matters.

  SKIP THIS:
    The JSX filter panel. It's just show/hide UI.

──────────────────────────────────────────────────────────────────────
 16. src/pages/student/StudentDashboard.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The two useQuery calls at the top.
    The stats useMemo block.

  UNDERSTAND:
    Two queries running simultaneously:

      const { data: jobsData } = useGetAllJobsQuery()
      const { data: appliedData } = useGetAppliedJobsQuery()

    RTK Query fires both in parallel. No waterfall.
    Both are cached — if you visited BrowseJobs or AppliedJobs
    before the dashboard, both return instantly with zero HTTP calls.

    stats useMemo shows derived data:
      const stats = useMemo(() => ({
        totalJobs: jobsData?.jobs?.length ?? 0,
        totalApplied: applied.length,
        pending: applied.filter(a => a.status === "pending").length,
        accepted: applied.filter(a => a.status === "accepted").length,
      }), [jobsData, appliedData])

    This recomputes only when jobsData or appliedData changes.
    Not on every render.

  SKIP THIS:
    The recentJobs and recentApps slices. They're just .slice(0, 4).

──────────────────────────────────────────────────────────────────────
 17. src/pages/student/JobDetail.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    useGetJobByIdQuery(jobId!) — a query with an argument.
    The alreadyApplied useMemo.
    handleApply.

  UNDERSTAND:
    useGetJobByIdQuery takes jobId from useParams as its argument.
    RTK Query uses the argument as part of the cache key.
    So job "abc" and job "xyz" are cached separately.
    Navigating back to a job you visited = instant load.

    alreadyApplied checks if the user already applied:
      const alreadyApplied = useMemo(() =>
        (appliedData?.applications ?? []).some(a =>
          a.job._id === jobId
        ),
        [appliedData, jobId]
      )

    If true → button shows "Applied ✓" and is disabled.
    If false → button shows "Apply Now".

    handleApply calls applyJob(jobId).unwrap().
    On success → toast + RTK Query invalidates Applications cache
    → AppliedJobs page will show the new application next time.

  SKIP THIS:
    The layout/styling JSX. Focus on the 3 logic blocks above.

──────────────────────────────────────────────────────────────────────
 18. src/api/companyApi.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    getCompaniesByRecruiter query — the scoped tag pattern.
    createCompany mutation — how userId is passed for invalidation.

  UNDERSTAND:
    getCompaniesByRecruiter takes userId as argument:
      providesTags: (_result, _err, userId) => [
        { type: "Companies", id: `recruiter-${userId}` }
      ]

    The cache key is "recruiter-abc123" not just "Companies".
    This means each recruiter gets their own separate cache entry.
    Recruiter A's company list never interferes with Recruiter B's.

    createCompany invalidates:
      [
        { type: "Companies", id: "LIST" },           ← global list
        { type: "Companies", id: `recruiter-${userId}` }  ← their list
      ]

    Both are invalidated so both refetch.
    This is the fix we applied — before the fix, only "LIST"
    was invalidated and the recruiter list never refetched.

  SKIP THIS:
    getAllCompanies and getCompanyById on first read.
    Same pattern as jobApi, nothing new.

──────────────────────────────────────────────────────────────────────
 19. src/pages/recruiter/MyCompanies.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    handleCreate — creating a company and cache invalidation.
    handleUpdate — editing a company.
    The editingId state pattern.

  UNDERSTAND:
    editingId state controls which company shows edit mode:
      editingId === company._id → show edit form
      editingId !== company._id → show card view

    This is a common pattern: store the ID of the item being
    edited instead of a boolean. A boolean only lets you edit
    one thing at a time but doesn't tell you WHICH one.

    handleCreate passes userId:
      createCompany({ companyName: newName, userId: user!._id })

    userId is stripped in the API layer before sending to server:
      query: ({ companyName }) => ({ data: { companyName } })

    userId never reaches the server in the request body.
    Server reads the user from the JWT cookie instead.
    userId is only there so RTK Query can build the right
    invalidation tag on the frontend.

  SKIP THIS:
    The JSX for the edit form. Focus on the handler functions.

──────────────────────────────────────────────────────────────────────
 20. src/api/applicationApi.ts
──────────────────────────────────────────────────────────────────────
  READ THIS:
    applyJob mutation.
    getAppliedJobs query.
    updateStatus mutation — the fixed version.

  UNDERSTAND:
    This is the file with the bug we fixed. Read both mutations
    carefully to understand the tag mismatch problem.

    getApplicants provides:
      { type: "Applicants", id: jobId }   ← uses jobId

    updateStatus (FIXED) invalidates:
      { type: "Applicants", id: jobId }   ← SAME jobId ✅

    updateStatus (BROKEN before fix) was:
      { type: "Applicants", id: id }      ← application _id ❌
                                            different string, no match

    The rule: the id in providesTags and the id in invalidatesTags
    must be the SAME STRING. Not just the same type of thing.
    The exact same string value.

  SKIP THIS:
    Nothing. Read all 4 endpoints. They're the most important
    examples of the tag matching rule in this project.

──────────────────────────────────────────────────────────────────────
 21. src/pages/recruiter/Applicants.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    handleStatusChange — the fixed version.
    The select onChange handler at the bottom of the JSX.

  UNDERSTAND:
    handleStatusChange now passes jobId:
      updateStatus({ id: app._id, jobId: jobId!, status })

    jobId comes from useParams() at the top of the component.
    It's the same jobId that getApplicants used in its providesTags.
    So now they match and the list refetches after every status change.

    The select onChange fires immediately when recruiter picks
    a new status from the dropdown. No "save" button needed.
    The mutation fires, server updates, cache invalidates,
    list refetches — all in one step.

  SKIP THIS:
    The applicant card JSX. Focus only on handleStatusChange
    and the select element's onChange.

──────────────────────────────────────────────────────────────────────
 22. src/components/ui/index.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    The memo() wrapper on JobCard.
    StatCard — simplest memoized component.

  UNDERSTAND:
    Every display component is wrapped in React.memo():
      export const JobCard = memo(({ job, ... }) => { ... })

    Without memo:
      Parent re-renders → ALL 50 JobCards re-render
      Even if none of their props changed.

    With memo:
      Parent re-renders → React checks each JobCard's props
      Only the ones with changed props re-render.
      If nothing changed, the previous render is reused.

    This matters when BrowseJobs shows 50+ jobs.
    Typing one character in the search box triggers a parent
    re-render. Without memo, all 50 cards re-render.
    With memo, 0 cards re-render (search updates debounced state,
    not job card props).

  SKIP THIS:
    ApplicationRow, CompanyCard, EmptyState, Skeleton on first read.
    They follow the same pattern as JobCard and StatCard.

──────────────────────────────────────────────────────────────────────
 23. src/components/layout/ — Navbar.tsx, Sidebar.tsx, DashboardLayout.tsx
──────────────────────────────────────────────────────────────────────
  READ THIS:
    DashboardLayout.tsx — the whole file (it's 20 lines)
    Sidebar.tsx — the navItems arrays and NavLink styling function
    Navbar.tsx — handleLogout function

  UNDERSTAND:
    DashboardLayout is just:
      <div>
        <Navbar />
        <Sidebar />
        <main><Outlet /></main>
      </div>

    Outlet here renders whichever child route is active.
    StudentDashboard, BrowseJobs, Applicants — they all render
    inside this same layout wrapper. Navbar and Sidebar are shared.

    Sidebar has two nav item arrays:
      const studentNav = [...]
      const recruiterNav = [...]
    It picks one based on role:
      const navItems = role === "recruiter" ? recruiterNav : studentNav
    One component, two behaviors. Role-aware at runtime.

    NavLink (not Link) gives you isActive in the style function:
      style={({ isActive }) => ({
        color: isActive ? "var(--accent)" : "var(--muted)"
      })}
    The active route highlights automatically. No manual state needed.

    Navbar handleLogout:
      await logout().unwrap()   ← tells server to clear cookie
      dispatch(clearUser())     ← clears Redux + localStorage
      navigate("/login")        ← redirect

    Even if the server call fails, clearUser() still runs.
    The user is logged out on the frontend regardless.

  SKIP THIS:
    The inline styles. They're just CSS, not logic.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 AFTER READING ALL 23 FILES — WHAT TO BUILD NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Now that you understand the project, solidify it by building:

  1. Add a "Save Job" feature (bookmark)
     → New bookmarks slice in Redux (no API needed, just localStorage)
     → Add a bookmark button to JobCard
     → Add a /student/saved route that reads from the slice
     Teaches: adding a new slice, reading from multiple state sources

  2. Add job search on the recruiter side
     → Copy the search + filter pattern from BrowseJobs.tsx
     → Apply it to MyJobs.tsx
     Teaches: reusing patterns, useMemo with filters

  3. Add a notification when application status changes
     → Poll getAppliedJobs every 30 seconds (RTK Query polling)
     → Compare previous status vs new status
     → Show toast if status changed
     Teaches: RTK Query polling (pollingInterval option)

  These are small enough to finish in a day each but teach
  real concepts from the project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 COMPLETE LIST OF WHAT WAS APPLIED IN THIS PROJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  REACT
  ─────
  ✅ React 18 with createRoot (concurrent rendering)
  ✅ useState        — local form and UI state
  ✅ useEffect       — event listeners, timers
  ✅ useMemo         — derived data (filtered jobs, stats, counts)
  ✅ useCallback     — stable handler references (in hooks)
  ✅ useRef          — click-outside detection
  ✅ React.memo      — memoized pure display components
  ✅ React.lazy()    — route-level code splitting
  ✅ Suspense        — fallback spinner while chunk loads
  ✅ StrictMode      — double-invoke in dev to catch bugs

  REDUX TOOLKIT (RTK)
  ───────────────────
  ✅ configureStore  — store setup
  ✅ createSlice     — authSlice, uiSlice
  ✅ PayloadAction   — typed reducer payloads
  ✅ useSelector     — read from store (typed via useAppSelector)
  ✅ useDispatch     — write to store (typed via useAppDispatch)
  ✅ localStorage persistence — auth survives page refresh

  RTK QUERY
  ─────────
  ✅ createApi / injectEndpoints — modular API splitting
  ✅ fetchBaseQuery (via custom axiosBaseQuery) — axios interceptors
  ✅ builder.query    — GET endpoints with caching
  ✅ builder.mutation — POST/PUT/PATCH endpoints
  ✅ providesTags     — declare what data a query caches
  ✅ invalidatesTags  — declare what a mutation clears
  ✅ keepUnusedDataFor — per-endpoint cache lifetimes
  ✅ refetchOnFocus   — stale data heals on tab focus
  ✅ refetchOnReconnect — heals after network drop
  ✅ Request deduplication — built in, automatic
  ✅ Scoped cache tags — recruiter-${userId}, company-${id}, jobId
  ✅ Surgical invalidation — only changed entity refetches
  ✅ .unwrap()        — clean try/catch on mutations

  ROUTING
  ───────
  ✅ React Router v6
  ✅ BrowserRouter, Routes, Route, Navigate
  ✅ Outlet          — nested route rendering
  ✅ useNavigate     — programmatic navigation
  ✅ useParams       — jobId, companyId from URL
  ✅ useLocation     — save attempted URL before redirect
  ✅ NavLink         — active state styling in sidebar
  ✅ PublicOnlyRoute — redirect logged-in users away
  ✅ ProtectedRoute  — redirect logged-out users to login
  ✅ RoleRoute       — redirect wrong-role users to own dashboard

  AXIOS
  ─────
  ✅ Single axios instance (axiosInstance.ts)
  ✅ withCredentials: true — httpOnly cookie auto-attached
  ✅ 15s timeout — no zombie requests
  ✅ Request interceptor — single place for future headers
  ✅ Response interceptor — global 401 handling via CustomEvent

  PERFORMANCE
  ───────────
  ✅ useDebounce(400ms) — search throttling
  ✅ Set for O(1) lookups — appliedJobIds
  ✅ React.memo on all display components
  ✅ useMemo on all derived/filtered data
  ✅ Vite manualChunks — vendor + redux separate bundles
  ✅ Route-level code splitting via React.lazy

  TYPESCRIPT
  ──────────
  ✅ Interfaces for all data shapes (types/index.ts)
  ✅ Typed Redux hooks (RootState, AppDispatch)
  ✅ Generic RTK Query types (what API returns, what it takes)
  ✅ Union types for roles and status values
  ✅ Typed populate (Application.findById().populate<{...}>)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 RTK QUERY vs TANSTACK QUERY — QUICK COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Same concept, different syntax:

  RTK Query (this project)        TanStack Query (equivalent)
  ────────────────────────────    ────────────────────────────
  builder.query(...)              useQuery(...)
  builder.mutation(...)           useMutation(...)
  providesTags / invalidatesTags  queryKey invalidation
  keepUnusedDataFor: 60           staleTime: 60000
  refetchOnFocus: true            refetchOnWindowFocus: true
  useGetAllJobsQuery()            useQuery({ queryKey, queryFn })
  useCreateJobMutation()          useMutation({ mutationFn })

  Once you understand one, the other takes 1 day.
  Learn RTK Query first since it's already in this project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ONE THING TO ALWAYS REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  If data updates on the server but the UI doesn't refresh:
  → The providesTags and invalidatesTags strings don't match.
  → That is always the reason. Check those two things first.
  → We fixed this bug twice in this project (applicants + companies).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━