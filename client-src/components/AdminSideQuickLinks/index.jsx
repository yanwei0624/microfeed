import React from 'react';
import ExternalLink from "../ExternalLink";
import {PUBLIC_URLS} from "../../../common-src/StringUtils";

export function SideQuickLink({url, text}) {
  return (<div className="mr-4">
    <ExternalLink url={url} text={text} linkClass="text-sm" iconClass="w-3"/>
  </div>);
}

export function AdminSideQuickLinks({AdditionalLinksDiv}) {
  return (<div className="lh-page-card mt-4 px-4">
    <div className="lh-page-subtitle">公共访问</div>
    <div className="grid grid-cols-1 gap-2">
      {AdditionalLinksDiv}
      <div className="flex flex-wrap gap-y-2">
        <SideQuickLink url={PUBLIC_URLS.webFeed()} text="网页订阅"/>
        <SideQuickLink url={PUBLIC_URLS.jsonFeed()} text="JSON 订阅"/>
        <SideQuickLink url={PUBLIC_URLS.rssFeed()} text="RSS 订阅"/>
      </div>
    </div>
  </div>);
}
