import React from 'react';
import {ADMIN_URLS} from "../../../../common-src/StringUtils";
import SettingsBase from '../SettingsBase';
import {SETTINGS_CATEGORIES, CODE_TYPES} from "../../../../common-src/Constants";

function NavBlock({url, text}) {
  return (<div>
    <a href={url}>
      {text} <span className="lh-icon-arrow-right"/>
    </a>
  </div>);
}

export default class CustomCodeSettingsApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentType: SETTINGS_CATEGORIES.CUSTOM_CODE,
    }
  }

  render() {
    const {submitting, submitForType} = this.props;
    const {currentType} = this.state;
    return (<SettingsBase
      title="自定义代码"
      submitting={submitting}
      submitForType={submitForType}
      currentType={currentType}
    >
      <NavBlock
        url={ADMIN_URLS.codeEditorSettings()}
        text="编辑跨网页的共享 HTML 代码"
      />
      <div className="text-xs text-muted-color mt-2">
        {'Code inside <head></head> and at top & bottom of <body></body>'}
      </div>

      <div className="mt-8">
        <div className="lh-page-subtitle">主题</div>
        <NavBlock
          url={`${ADMIN_URLS.codeEditorSettings()}?type=${CODE_TYPES.THEMES}&theme=custom`}
          text="编辑网页和 RSS 样式"
        />
        <div className="text-xs text-muted-color mt-2">
          <em>microfeed will support multiple themes / templates in the future</em>
        </div>
      </div>
    </SettingsBase>);
  }
}
