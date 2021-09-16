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

export type Mutation = {
  __typename?: 'Mutation';
  createApp: App;
  createProject: Project;
};


export type MutationCreateAppArgs = {
  projectId: Scalars['String'];
  type: AppType;
};


export type MutationCreateProjectArgs = {
  name: Scalars['String'];
};

export type Project = {
  __typename?: 'Project';
  _id: Scalars['String'];
  app: Array<App>;
  createdAt: Scalars['DateTime'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
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


export type GetSingleProjectQuery = { __typename?: 'Query', project: { __typename?: 'Project', _id: string, name: string, app: Array<{ __typename?: 'App', type: AppType }> } };

export type CreateProjectMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', name: string, app: Array<{ __typename?: 'App', type: AppType }> } };


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
    app {
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