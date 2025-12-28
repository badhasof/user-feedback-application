/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendOTP from "../ResendOTP.js";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as comments from "../comments.js";
import type * as featureRequests from "../featureRequests.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as kanban from "../kanban.js";
import type * as migrations from "../migrations.js";
import type * as public_ from "../public.js";
import type * as roadmap from "../roadmap.js";
import type * as router from "../router.js";
import type * as teamMembers from "../teamMembers.js";
import type * as teams from "../teams.js";
import type * as userProfiles from "../userProfiles.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  admin: typeof admin;
  auth: typeof auth;
  comments: typeof comments;
  featureRequests: typeof featureRequests;
  feedback: typeof feedback;
  http: typeof http;
  kanban: typeof kanban;
  migrations: typeof migrations;
  public: typeof public_;
  roadmap: typeof roadmap;
  router: typeof router;
  teamMembers: typeof teamMembers;
  teams: typeof teams;
  userProfiles: typeof userProfiles;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
