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
  softDeleted: Scalars['Boolean'];
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

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', _id: string, name: string, app: Array<{ __typename?: 'App', type: AppType }> }> };

export type GetSingleProjectQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetSingleProjectQuery = { __typename?: 'Query', project: { __typename?: 'Project', _id: string, name: string, bio?: Maybe<string>, alias?: Maybe<string>, description?: Maybe<string>, url?: Maybe<string>, avatar?: Maybe<string>, createdAt: any, app: Array<{ __typename?: 'App', _id: string, name: string, type: AppType }> } };

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', name: string, app: Array<{ __typename?: 'App', type: AppType }> } };

export type ArchiveProjectMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ArchiveProjectMutation = { __typename?: 'Mutation', archiveProject: { __typename?: 'Project', name: string } };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject: { __typename?: 'DeleteResult', acknowledged: boolean, deletedCount: number } };

export type DeleteAppMutationVariables = Exact<{
  projectId: Scalars['String'];
  appId: Scalars['String'];
}>;


export type DeleteAppMutation = { __typename?: 'Mutation', deleteApp: { __typename?: 'DeleteResult', acknowledged: boolean, deletedCount: number } };

export type UpdateGeneralProjectInfoMutationVariables = Exact<{
  id: Scalars['String'];
  name: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  alias?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
}>;


export type UpdateGeneralProjectInfoMutation = { __typename?: 'Mutation', updateGeneralProjectInfo: { __typename?: 'Project', name: string } };

export type UpdateProjectAvatarMutationVariables = Exact<{
  id: Scalars['String'];
  avatar: Scalars['String'];
}>;


export type UpdateProjectAvatarMutation = { __typename?: 'Mutation', updateProjectAvatar: { __typename?: 'Project', name: string } };

export type ResetProjectAvatarMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type ResetProjectAvatarMutation = { __typename?: 'Mutation', resetProjectAvatar: { __typename?: 'Project', name: string } };


export const GetProjectsDoc = gql`
    query GetProjects {
  projects {
    _id
    name
    app {
      type
    }
  }
}
    `;
export const GetSingleProjectDoc = gql`
    query GetSingleProject($id: String!) {
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
export const CreateProjectDoc = gql`
    mutation CreateProject($name: String!) {
  createProject(name: $name) {
    name
    app {
      type
    }
  }
}
    `;
export const ArchiveProjectDoc = gql`
    mutation ArchiveProject($id: String!) {
  archiveProject(id: $id) {
    name
  }
}
    `;
export const DeleteProjectDoc = gql`
    mutation DeleteProject($id: String!) {
  deleteProject(id: $id) {
    acknowledged
    deletedCount
  }
}
    `;
export const DeleteAppDoc = gql`
    mutation DeleteApp($projectId: String!, $appId: String!) {
  deleteApp(projectId: $projectId, appId: $appId) {
    acknowledged
    deletedCount
  }
}
    `;
export const UpdateGeneralProjectInfoDoc = gql`
    mutation UpdateGeneralProjectInfo($id: String!, $name: String!, $bio: String, $alias: String, $description: String, $url: String) {
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
export const UpdateProjectAvatarDoc = gql`
    mutation UpdateProjectAvatar($id: String!, $avatar: String!) {
  updateProjectAvatar(id: $id, avatar: $avatar) {
    name
  }
}
    `;
export const ResetProjectAvatarDoc = gql`
    mutation ResetProjectAvatar($id: String!) {
  resetProjectAvatar(id: $id) {
    name
  }
}
    `;
export const GetProjects = (
            options: Omit<
              WatchQueryOptions<GetProjectsQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GetProjectsQuery> & {
              query: ObservableQuery<
                GetProjectsQuery,
                GetProjectsQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GetProjectsDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GetProjectsQuery> & {
                query: ObservableQuery<
                  GetProjectsQuery,
                  GetProjectsQueryVariables
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
        
export const GetSingleProject = (
            options: Omit<
              WatchQueryOptions<GetSingleProjectQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GetSingleProjectQuery> & {
              query: ObservableQuery<
                GetSingleProjectQuery,
                GetSingleProjectQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GetSingleProjectDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GetSingleProjectQuery> & {
                query: ObservableQuery<
                  GetSingleProjectQuery,
                  GetSingleProjectQueryVariables
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
        
export const CreateProject = (
            options: Omit<
              MutationOptions<any, CreateProjectMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<CreateProjectMutation, CreateProjectMutationVariables>({
              mutation: CreateProjectDoc,
              ...options,
            });
            return m;
          }
export const ArchiveProject = (
            options: Omit<
              MutationOptions<any, ArchiveProjectMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<ArchiveProjectMutation, ArchiveProjectMutationVariables>({
              mutation: ArchiveProjectDoc,
              ...options,
            });
            return m;
          }
export const DeleteProject = (
            options: Omit<
              MutationOptions<any, DeleteProjectMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<DeleteProjectMutation, DeleteProjectMutationVariables>({
              mutation: DeleteProjectDoc,
              ...options,
            });
            return m;
          }
export const DeleteApp = (
            options: Omit<
              MutationOptions<any, DeleteAppMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<DeleteAppMutation, DeleteAppMutationVariables>({
              mutation: DeleteAppDoc,
              ...options,
            });
            return m;
          }
export const UpdateGeneralProjectInfo = (
            options: Omit<
              MutationOptions<any, UpdateGeneralProjectInfoMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateGeneralProjectInfoMutation, UpdateGeneralProjectInfoMutationVariables>({
              mutation: UpdateGeneralProjectInfoDoc,
              ...options,
            });
            return m;
          }
export const UpdateProjectAvatar = (
            options: Omit<
              MutationOptions<any, UpdateProjectAvatarMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<UpdateProjectAvatarMutation, UpdateProjectAvatarMutationVariables>({
              mutation: UpdateProjectAvatarDoc,
              ...options,
            });
            return m;
          }
export const ResetProjectAvatar = (
            options: Omit<
              MutationOptions<any, ResetProjectAvatarMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<ResetProjectAvatarMutation, ResetProjectAvatarMutationVariables>({
              mutation: ResetProjectAvatarDoc,
              ...options,
            });
            return m;
          }