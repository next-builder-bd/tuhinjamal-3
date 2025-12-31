// plugins/types.ts
import React, { JSX } from 'react';
export type PluginPageProps = {
  params: Record<string, string>;
};

export type PluginPage = (props: PluginPageProps) => JSX.Element | Promise<JSX.Element>;
