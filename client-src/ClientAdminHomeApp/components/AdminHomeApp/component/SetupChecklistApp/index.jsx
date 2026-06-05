import React, {useState} from 'react';
import {ONBOARDING_TYPES, OUR_BRAND, SETTINGS_CATEGORIES} from "../../../../../../common-src/Constants";
import {CheckCircleIcon, ArrowRightCircleIcon} from "@heroicons/react/20/solid";
import AdminInput from "../../../../../components/AdminInput";
import Requests from "../../../../../common/requests";
import {ADMIN_URLS, isValidUrl} from "../../../../../../common-src/StringUtils";
import {showToast} from "../../../../../common/ToastUtils";

const SUBMIT_STATUS__START = 1;

function CheckListItem({title, onboardState, children}) {
  return (<div className="flex">
    <div className="mr-4">
      {onboardState.ready ? <CheckCircleIcon className="w-6 text-green-500" /> :
        <ArrowRightCircleIcon className="w-6 text-muted-color" />}
    </div>
    <details className="w-full" open={!onboardState.ready}>
      <summary className="cursor-pointer mb-4 font-semibold hover:opacity-50">
        {title} {onboardState.required && <span className="text-red-500">*</span>}
      </summary>
      <div className="mb-8">
        {children}
      </div>
    </details>
  </div>);
}

function SetupPublicBucketUrl({onboardState, webGlobalSettings, cloudflareUrls}) {
  const publicBucketUrl = webGlobalSettings.publicBucketUrl || '';
  const [url, setUrl] = useState(publicBucketUrl);
  const [submitStatus, setSubmitStatus] = useState(null);
  const submitting = submitStatus === SUBMIT_STATUS__START;
  return (<CheckListItem onboardState={onboardState} title="设置 R2 公共储存桶 URL">
    <div className="flex">
      <div className="mr-4 flex-1">
        <AdminInput
          type="url"
          placeholder="e.g., https://cdn.example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="flex-none">
        <button
          type="button"
          disabled={submitting}
          className="lh-btn lh-btn-brand-dark"
          onClick={(e) => {
            e.preventDefault();
            if (!isValidUrl(url)) {
              showToast('Invalid url. A valid url should start with http:// or https://, ' +
                'for example, https://media-cdn.microfeed.org',
                'error', 5000);
              return;
            }
            setSubmitStatus(SUBMIT_STATUS__START);
            Requests.axiosPost(ADMIN_URLS.ajaxFeed(), {
              settings: {
                [SETTINGS_CATEGORIES.WEB_GLOBAL_SETTINGS]: {
                  ...webGlobalSettings,
                  publicBucketUrl: url,
                },
              }
            }).then(() => {
              showToast('Updated!', 'success');
              setTimeout(() => {
                location.href = '';
              }, 1500);
            }).catch((error) => {
              setSubmitStatus(null);
              if (!error.response) {
                showToast('Network error. Please refresh the page and try again.', 'error');
              } else {
                showToast('Failed. Please try again.', 'error');
              }
            });
          }}
        >
          {submitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
    <div className="mt-4 rounded-sm bg-gray-100 p-2 text-sm grid grid-cols-1 gap-2">
      <details>
        <summary className="cursor-pointer font-semibold hover:opacity-50">
          如何找到 R2 公共储存桶 URL？
        </summary>
        <div className="my-8 text-helper-color">
          <div>
            Go to <a href={cloudflareUrls.r2BucketSettingsUrl} target="_blank" rel="noopener noreferrer">
              Cloudflare Dashboard / R2 Bucket Settings <span className="lh-icon-arrow-right" /></a>
          </div>
          <div className="mt-4">
            <div>
              <span className="text-brand-light font-bold">[Recommended]</span> Add a custom domain (e.g., media-cdn.microfeed.org). Then copy this custom domain here (e.g., https://media-cdn.microfeed.org).
            </div>
            <div className="mt-2">
              <img src="/assets/howto/get-r2-public-bucket-url-howto2.png" className="w-full" />
            </div>
          </div>
          <div className="mt-4">
            <div>
              <span className="text-brand-light">[Ok, but not recommended]</span> If you don't have a custom domain, you can also use Cloudflare's r2.dev domain - Click "Allow Access". Then copy "Public Bucket URL" here (e.g., https://pub-xxxx.r2.dev).
            </div>
            <div className="mt-2">
              <img src="/assets/howto/get-r2-public-bucket-url-howto1.png" className="w-full" />
            </div>
          </div>
        </div>
      </details>
      <details>
        <summary className="cursor-pointer font-semibold hover:opacity-50">
          R2 公共储存桶 URL 有什么用？
        </summary>
        <div className="my-8 text-helper-color">
          <div>
            您将在 Cloudflare R2 上存储媒体文件（如音频、视频、图片、文档...）。为了向公众提供这些文件，您需要提供一个 R2 公共储存桶 URL。
          </div>
          <div className="mt-2">
            假设 R2 公共储存桶 URL 为 https://cdn.example.com，则媒体文件（如音频）可通过 https://cdn.example.com/some-audio.mp3 访问
          </div>
        </div>
      </details>
      <details>
        <summary className="cursor-pointer font-semibold hover:opacity-50">
          如何确保该 URL 有效？
        </summary>
        <div className="my-8 text-helper-color">
          <div>
            当您打开这个 R2 公共储存桶 URL 时，您会看到类似这样的 404 页面 (e.g., <a href={OUR_BRAND.exampleCdnUrl} target="_blank">https://media-cdn.microfeed.org</a>):
          </div>
          <div className="mt-2">
            <img src="/assets/howto/get-r2-public-bucket-url-howto3.png" className="w-full" />
          </div>
        </div>
      </details>
    </div>
  </CheckListItem>);
}

function ProtectedAdminDashboard({onboardState, cloudflareUrls}) {
  return (<CheckListItem onboardState={onboardState} title="为管理面板添加登录">
    <div className="mt-4 rounded-sm bg-gray-100 p-2 text-sm grid grid-cols-1 gap-2 text-helper-color">
      <div className="mb-2">
        You will use <a href="https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/" target="_blank">
        Cloudflare Zero Trust</a> to add a login, so ONLY authorized users can access this admin dashboard.
      </div>
      <details>
        <summary className="cursor-pointer hover:opacity-50 text-black font-semibold">
          步骤 1：添加访问组
        </summary>
        <div className="mt-4">
          Go to <a href={cloudflareUrls.addAccessGroupUrl} target="_blank">Cloudflare Dashboard / Add an access group <span className="lh-icon-arrow-right"/></a>
        </div>
        <div className="my-4">
          如果这是您第一次使用 Cloudflare Zero Trust，您可能需要先注册免费计划。
        </div>
        <div className="mt-4">
          您需要指定哪些邮箱被允许访问此管理面板：
        </div>
        <div className="mt-2">
          <img src="/assets/howto/add-access-group.png" className="w-full border"/>
        </div>
      </details>
      <details>
        <summary className="cursor-pointer hover:opacity-50 text-black font-semibold">
          步骤 2：创建自托管应用以保护 <b>{cloudflareUrls.pagesDevUrl}/admin</b>
        </summary>
        <div className="mt-4">
          Go to <a href={cloudflareUrls.addAppUrl} target="_blank">
          Cloudflare Dashboard / Create a self-hosted app <span className="lh-icon-arrow-right"/>
        </a>
        </div>
        <div className="mt-4">
          Select "Self-hosted" here:
        </div>
        <div className="mt-2">
          <img src="/assets/howto/select-self-hosted-app.png" className="w-full border"/>
        </div>
        <div className="mt-4">
          Fill in info for <b>{cloudflareUrls.pagesDevUrl}/admin</b>:
        </div>
        <div className="mt-2 text-red-500">
          {'Note: Please follow numbered arrows in order. Otherwise, "Path" may not be edited. ' +
           'If you see "the zone does not exist" message, please ignore it and go ahead to Next. ' +
           'We hope Cloudflare can improve their UI to make things less confusing :)'}
        </div>
        <div className="mt-2">
          <img src="/assets/howto/add-app1.png" className="w-full border"/>
        </div>
        <div className="mt-4">
          Add policy name, then click "Next" all the way until you add the app:
        </div>
        <div className="my-4">
          <img src="/assets/howto/add-app2.png" className="w-full border"/>
        </div>
      </details>
      <details>
        <summary className="cursor-pointer hover:opacity-50 text-black font-semibold">
          步骤 3：检查是否生效
        </summary>
        <div className="mt-4">
          刷新当前页面，您将能够用您的邮箱登录。
        </div>
        <div className="my-4">
          <img src="/assets/howto/app-access-login.png" className="w-full border"/>
        </div>
      </details>
      <details>
        <summary className="cursor-pointer hover:opacity-50 text-black font-semibold">
          额外：为创建自托管应用 <b>*.{cloudflareUrls.pagesDevUrl}</b>
        </summary>
        <div className="mt-4">
        You may want to create a 2nd self-hosted app for <b>*.{cloudflareUrls.pagesDevUrl}</b>, which will
        protect all <a href="https://developers.cloudflare.com/pages/platform/preview-deployments/" target="_blank">preview
        deployments</a>.
        </div>
        <div className="mt-4">
          Go to <a href={cloudflareUrls.addAppUrl} target="_blank">
          Cloudflare Dashboard / Create a self-hosted app <span className="lh-icon-arrow-right"/>
        </a>
        </div>
        <div className="my-4">
          Put an asterisk (*) to Subdomain:
        </div>
        <div className="my-4">
          <img src="/assets/howto/protect-preview.png" className="w-full border"/>
        </div>
      </details>
    </div>
  </CheckListItem>);
}

function CustomDomain({onboardState, cloudflareUrls}) {
  return (<CheckListItem onboardState={onboardState} title="使用自定义域名">
    <div className="mt-4 rounded-sm bg-gray-100 p-2 text-sm grid grid-cols-1 gap-2 text-helper-color">
      <div className="mb-2">
        Using custom domain, you can benefit from Cloudflare features such as bot management, Access, and Cache.
      </div>
      <details>
        <summary className="cursor-pointer hover:opacity-50 text-black font-semibold">
          Step 1: Setup custom domain for this site
        </summary>
        <div className="mt-4">
          Go to <a href={cloudflareUrls.pagesCustomDomainUrl} target="_blank">Cloudflare Dashboard / Pages Settings<span
          className="lh-icon-arrow-right"/></a>
        </div>
        <div className="my-4">
          <img src="/assets/howto/pages-custom-domain.png" className="w-full border"/>
        </div>
      </details>
      <details>
        <summary className="cursor-pointer hover:opacity-50 text-black font-semibold">
          步骤 2：创建自托管应用以保护 admin dashboard
        </summary>
        <div className="mt-4">
          If you want to access this admin dashboard from your newly added custom domain, you have to create a
          self-hosted app for the admin url. Instead of using {cloudflareUrls.pagesDevUrl}, use your new custom domain
          this time.
        </div>
        <div className="mt-4">
          Go to <a href={cloudflareUrls.addAppUrl} target="_blank">
            Cloudflare Dashboard / Add an application <span className="lh-icon-arrow-right"/>
          </a>
        </div>
        <div className="my-4">
          <img src="/assets/howto/add-app3.png" className="w-full border"/>
        </div>
      </details>
    </div>
  </CheckListItem>);
}

export default class SetupChecklistApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {feed, onboardingResult} = this.props;
    const {settings} = feed;
    const webGlobalSettings = settings[SETTINGS_CATEGORIES.WEB_GLOBAL_SETTINGS] || {};

    return (<div className="lh-page-card">
      <div className="lh-page-title">
        初始化检查清单
      </div>
      {onboardingResult.allOk && <div className="text-helper-color border border-green-700 bg-green-100 text-green-700 rounded-sm p-2">
        <i>已经完成配置！</i>
        <div className="mt-2">
          开始发布： <a href={ADMIN_URLS.newItem()}>添加新项目 <span className="lh-icon-arrow-right" /></a>
        </div>
      </div>}
      <div className="mt-8">
        <SetupPublicBucketUrl
          onboardState={onboardingResult.result[ONBOARDING_TYPES.VALID_PUBLIC_BUCKET_URL]}
          webGlobalSettings={webGlobalSettings}
          cloudflareUrls={onboardingResult.cloudflareUrls}
        />
        <ProtectedAdminDashboard
          onboardState={onboardingResult.result[ONBOARDING_TYPES.PROTECTED_ADMIN_DASHBOARD]}
          cloudflareUrls={onboardingResult.cloudflareUrls}
        />
        <CustomDomain
          onboardState={onboardingResult.result[ONBOARDING_TYPES.CUSTOM_DOMAIN]}
          cloudflareUrls={onboardingResult.cloudflareUrls}
        />
      </div>
      <div className="text-right mt-4 text-sm text-helper-color">
        <span className="text-red-500">*</span> 必填
      </div>
    </div>);
  }
}
