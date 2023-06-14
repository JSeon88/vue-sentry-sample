import Vue from "vue";
import * as Sentry from "@sentry/vue";
import { getRunTypeConfig } from "../config/run-type";
import { router } from "../router";

/**
 * Sentry 환경 변수 반환
 * @returns {{
 *   SENTRY_DSN: string;
 *   SENTRY_PROJECT_NAME: string;
 * }} Sentry 환경 변수.
 */
export const getSentryEnv = (): {
  /** DSN */
  SENTRY_DSN: string;
  /** 프로젝트 이름 */
  SENTRY_PROJECT_NAME: string;
} => {
  const { SENTRY_DSN, SENTRY_PROJECT_NAME } = getRunTypeConfig(
    process.env.RUN_TYPE
  );
  if (
    typeof SENTRY_DSN === "string" &&
    typeof SENTRY_PROJECT_NAME === "string"
  ) {
    return { SENTRY_DSN, SENTRY_PROJECT_NAME };
  }

  return { SENTRY_DSN: "", SENTRY_PROJECT_NAME: "" };
};

/**
 * Sentry 활성화 여부 확인
 * @returns {boolean} Sentry가 활성화 조건에 부합되는지 여부를 나타냅니다.
 */
export const isEnableSentry = (): boolean => {
  const { SENTRY_DSN, SENTRY_PROJECT_NAME } = getSentryEnv();
  const isProductionMode = process.env.NODE_ENV === "production";
  const isForceSentryOn = process.env.SENTRY === "on";
  const hasEnvVariables = !!(SENTRY_DSN && SENTRY_PROJECT_NAME);

  let isInjectSentryConfig = isProductionMode && hasEnvVariables;

  // 강제 sentry 설정 객체 활성화 체크
  if (isForceSentryOn && hasEnvVariables) {
    isInjectSentryConfig = true;
  }

  return isInjectSentryConfig;
};

/**
 * Sentry를 초기화
 * @returns {void}
 */
export const initSentry = (): void => {
  if (!isEnableSentry()) {
    return;
  }

  const { SENTRY_DSN } = getSentryEnv();

  Sentry.init({
    Vue: Vue,
    dsn: SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
    ],
    tracesSampleRate: 1.0,
    ignoreErrors: [],
  });
};
