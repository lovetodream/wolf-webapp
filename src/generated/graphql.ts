import client from "@/apollo-client";
import type {
        ApolloQueryResult, ObservableQuery, WatchQueryOptions, MutationOptions
      } from "@apollo/client/core";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";
import gql from "graphql-tag"
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type App = {
  __typename?: 'App';
  _id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  name: Scalars['String'];
  project: Project;
  type: AppType;
  updatedAt: Scalars['DateTime'];
};

export enum AppType {
  Android = 'ANDROID',
  Ios = 'IOS',
  Other = 'OTHER',
  Web = 'WEB'
}

export type DeleteResult = {
  __typename?: 'DeleteResult';
  acknowledged: Scalars['Boolean'];
  deletedCount: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  archiveProject: Project;
  createApp: App;
  createProject: Project;
  deleteApp: DeleteResult;
  deleteProject: DeleteResult;
  resetProjectAvatar: Project;
  updateGeneralProjectInfo: Project;
  updateProjectAvatar: Project;
  updateProjectSecuritySettings: Project;
};


export type MutationArchiveProjectArgs = {
  id: Scalars['String'];
};


export type MutationCreateAppArgs = {
  projectId: Scalars['String'];
  type: AppType;
};


export type MutationCreateProjectArgs = {
  name: Scalars['String'];
};


export type MutationDeleteAppArgs = {
  appId: Scalars['String'];
  projectId: Scalars['String'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['String'];
};


export type MutationResetProjectAvatarArgs = {
  id: Scalars['String'];
};


export type MutationUpdateGeneralProjectInfoArgs = {
  alias?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};


export type MutationUpdateProjectAvatarArgs = {
  avatar: Scalars['String'];
  id: Scalars['String'];
};


export type MutationUpdateProjectSecuritySettingsArgs = {
  id: Scalars['String'];
  pin?: Maybe<Scalars['Float']>;
  recoveryEmail?: Maybe<Scalars['String']>;
  strictMode: Scalars['Boolean'];
};

export type Project = {
  __typename?: 'Project';
  _id: Scalars['String'];
  alias?: Maybe<Scalars['String']>;
  app: Array<App>;
  archived: Scalars['Boolean'];
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  pin: Scalars['Boolean'];
  recoveryEmail?: Maybe<Scalars['String']>;
  softDeleted: Scalars['Boolean'];
  strictMode: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  url?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  app: App;
  project: Project;
  projects: Array<Project>;
};


export type QueryAppArgs = {
  id: Scalars['String'];
};


export type QueryProjectArgs = {
  id: Scalars['String'];
};

export type GqlGetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GqlGetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', _id: string, name: string, app: Array<{ __typename?: 'App', type: AppType }> }> };

export type GqlGetSingleProjectQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GqlGetSingleProjectQuery = { __typename?: 'Query', project: { __typename?: 'Project', _id: string, name: string, bio?: Maybe<string>, alias?: Maybe<string>, description?: Maybe<string>, url?: Maybe<string>, avatar?: Maybe<string>, createdAt: any, app: Array<{ __typename?: 'App', _id: string, name: string, type: AppType }> } };

export type GqlGetProjectSecuritySettingsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GqlGetProjectSecuritySettingsQuery = { __typename?: 'Query', project: { __typename?: 'Project', strictMode: boolean, recoveryEmail?: Maybe<string>, pin: boolean } };

export type GqlUpdateProjectSecuritySettingsMutationVariables = Exact<{
  id: Scalars['String'];
  strictMode: Scalars['Boolean'];
  recoveryEmail?: Maybe<Scalars['String']>;
  pin?: Maybe<Scalars['Float']>;
}>;


export type GqlUpdateProjectSecuritySettingsMutation = { __typename?: 'Mutation', updateProjectSecuritySettings: { __typename?: 'Project', name: string } };

export type GqlCreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type GqlCreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', name: string, app: Array<{ __typename?: 'App', type: AppType }> } };

export type GqlArchiveProjectMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type GqlArchiveProjectMutation = { __typename?: 'Mutation', archiveProject: { __typename?: 'Project', name: string } };

export type GqlDeleteProjectMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type GqlDeleteProjectMutation = { __typename?: 'Mutation', deleteProject: { __typename?: 'DeleteResult', acknowledged: boolean, deletedCount: number } };

export type GqlDeleteAppMutationVariables = Exact<{
  projectId: Scalars['String'];
  appId: Scalars['String'];
}>;


export type GqlDeleteAppMutation = { __typename?: 'Mutation', deleteApp: { __typename?: 'DeleteResult', acknowledged: boolean, deletedCount: number } };

export type GqlUpdateGeneralProjectInfoMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  alias?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
}>;


export type GqlUpdateGeneralProjectInfoMutation = { __typename?: 'Mutation', updateGeneralProjectInfo: { __typename?: 'Project', name: string } };

export type GqlUpdateProjectAvatarMutationVariables = Exact<{
  id: Scalars['String'];
  avatar: Scalars['String'];
}>;


export type GqlUpdateProjectAvatarMutation = { __typename?: 'Mutation', updateProjectAvatar: { __typename?: 'Project', name: string } };

export type GqlResetProjectAvatarMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type GqlResetProjectAvatarMutation = { __typename?: 'Mutation', resetProjectAvatar: { __typename?: 'Project', name: string } };


export const GqlGetProjectsDoc = gql`
    query gqlGetProjects {
  projects {
    _id
    name
    app {
      type
    }
  }
}
    `;
export const GqlGetSingleProjectDoc = gql`
    query gqlGetSingleProject($id: String!) {
  project(id: $id) {
    _id
    name
    bio
    alias
    description
    url
    avatar
    createdAt
    app {
      _id
      name
      type
    }
  }
}
    `;
export const GqlGetProjectSecuritySettingsDoc = gql`
    query gqlGetProjectSecuritySettings($id: String!) {
  project(id: $id) {
    strictMode
    recoveryEmail
    pin
  }
}
    `;
export const GqlUpdateProjectSecuritySettingsDoc = gql`
    mutation gqlUpdateProjectSecuritySettings($id: String!, $strictMode: Boolean!, $recoveryEmail: String, $pin: Float) {
  updateProjectSecuritySettings(
    id: $id
    strictMode: $strictMode
    recoveryEmail: $recoveryEmail
    pin: $pin
  ) {
    name
  }
}
    `;
export const GqlCreateProjectDoc = gql`
    mutation gqlCreateProject($name: String!) {
  createProject(name: $name) {
    name
    app {
      type
    }
  }
}
    `;
export const GqlArchiveProjectDoc = gql`
    mutation gqlArchiveProject($id: String!) {
  archiveProject(id: $id) {
    name
  }
}
    `;
export const GqlDeleteProjectDoc = gql`
    mutation gqlDeleteProject($id: String!) {
  deleteProject(id: $id) {
    acknowledged
    deletedCount
  }
}
    `;
export const GqlDeleteAppDoc = gql`
    mutation gqlDeleteApp($projectId: String!, $appId: String!) {
  deleteApp(projectId: $projectId, appId: $appId) {
    acknowledged
    deletedCount
  }
}
    `;
export const GqlUpdateGeneralProjectInfoDoc = gql`
    mutation gqlUpdateGeneralProjectInfo($id: String!, $name: String!, $bio: String, $alias: String, $description: String, $url: String) {
  updateGeneralProjectInfo(
    id: $id
    name: $name
    bio: $bio
    alias: $alias
    description: $description
    url: $url
  ) {
    name
  }
}
    `;
export const GqlUpdateProjectAvatarDoc = gql`
    mutation gqlUpdateProjectAvatar($id: String!, $avatar: String!) {
  updateProjectAvatar(id: $id, avatar: $avatar) {
    name
  }
}
    `;
export const GqlResetProjectAvatarDoc = gql`
    mutation gqlResetProjectAvatar($id: String!) {
  resetProjectAvatar(id: $id) {
    name
  }
}
    `;
export const gqlGetProjects = (
            options: Omit<
              WatchQueryOptions<GqlGetProjectsQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GqlGetProjectsQuery> & {
              query: ObservableQuery<
                GqlGetProjectsQuery,
                GqlGetProjectsQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GqlGetProjectsDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GqlGetProjectsQuery> & {
                query: ObservableQuery<
                  GqlGetProjectsQuery,
                  GqlGetProjectsQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
export const gqlGetSingleProject = (
            options: Omit<
              WatchQueryOptions<GqlGetSingleProjectQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GqlGetSingleProjectQuery> & {
              query: ObservableQuery<
                GqlGetSingleProjectQuery,
                GqlGetSingleProjectQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GqlGetSingleProjectDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GqlGetSingleProjectQuery> & {
                query: ObservableQuery<
                  GqlGetSingleProjectQuery,
                  GqlGetSingleProjectQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
export const gqlGetProjectSecuritySettings = (
            options: Omit<
              WatchQueryOptions<GqlGetProjectSecuritySettingsQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GqlGetProjectSecuritySettingsQuery> & {
              query: ObservableQuery<
                GqlGetProjectSecuritySettingsQuery,
                GqlGetProjectSecuritySettingsQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GqlGetProjectSecuritySettingsDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GqlGetProjectSecuritySettingsQuery> & {
                query: ObservableQuery<
                  GqlGetProjectSecuritySettingsQuery,
                  GqlGetProjectSecuritySettingsQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
export const gqlUpdateProjectSecuritySettings = (
            options: Omit<
              MutationOptions<any, GqlUpdateProjectSecuritySettingsMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<GqlUpdateProjectSecuritySettingsMutation, GqlUpdateProjectSecuritySettingsMutationVariables>({
              mutation: GqlUpdateProjectSecuritySettingsDoc,
              ...options,
            });
            return m;
          }
export const gqlCreateProject = (
            options: Omit<
              MutationOptions<any, GqlCreateProjectMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<GqlCreateProjectMutation, GqlCreateProjectMutationVariables>({
              mutation: GqlCreateProjectDoc,
              ...options,
            });
            return m;
          }
export const gqlArchiveProject = (
            options: Omit<
              MutationOptions<any, GqlArchiveProjectMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<GqlArchiveProjectMutation, GqlArchiveProjectMutationVariables>({
              mutation: GqlArchiveProjectDoc,
              ...options,
            });
            return m;
          }
export const gqlDeleteProject = (
            options: Omit<
              MutationOptions<any, GqlDeleteProjectMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<GqlDeleteProjectMutation, GqlDeleteProjectMutationVariables>({
              mutation: GqlDeleteProjectDoc,
              ...options,
            });
            return m;
          }
export const gqlDeleteApp = (
            options: Omit<
              MutationOptions<any, GqlDeleteAppMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<GqlDeleteAppMutation, GqlDeleteAppMutationVariables>({
              mutation: GqlDeleteAppDoc,
              ...options,
            });
            return m;
          }
export const gqlUpdateGeneralProjectInfo = (
            options: Omit<
              MutationOptions<any, GqlUpdateGeneralProjectInfoMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<GqlUpdateGeneralProjectInfoMutation, GqlUpdateGeneralProjectInfoMutationVariables>({
              mutation: GqlUpdateGeneralProjectInfoDoc,
              ...options,
            });
            return m;
          }
export const gqlUpdateProjectAvatar = (
            options: Omit<
              MutationOptions<any, GqlUpdateProjectAvatarMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<GqlUpdateProjectAvatarMutation, GqlUpdateProjectAvatarMutationVariables>({
              mutation: GqlUpdateProjectAvatarDoc,
              ...options,
            });
            return m;
          }
export const gqlResetProjectAvatar = (
            options: Omit<
              MutationOptions<any, GqlResetProjectAvatarMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<GqlResetProjectAvatarMutation, GqlResetProjectAvatarMutationVariables>({
              mutation: GqlResetProjectAvatarDoc,
              ...options,
            });
            return m;
          }