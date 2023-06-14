import dev from "./dev.json";
import live from "./live.json";

const configs = {
  dev,
  live,
};

/**
 * 타입별 환경변수를 반환
 * @param {keyof typeof configs} runType - 환경변수를 가져올 타입.
 * @param {keyof typeof configs} [defaultRunType='live'] - 기본 타입으로 사용할 타입 (선택 사항).
 * @returns {Record<string, string | Record<string, string | number>>} 환경변수 객체.
 */
export const getRunTypeConfig = (
  runType: keyof typeof configs,
  defaultRunType: keyof typeof configs = "live"
): Record<string, string | Record<string, string | number>> => {
  return configs[runType] || configs[defaultRunType] || {};
};
