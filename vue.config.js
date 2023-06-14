const { execSync } = require("child_process");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const privateRunTypeEnv = require(`./src/config/run-type/${process.env.RUN_TYPE}.json`);
const isProductionMode = process.env.NODE_ENV === "production";

const config = {
  publicPath: "/",
  // 실행할 때 최초 한번만 실행
  chainWebpack: (config) => {
    // 전역 상수 추가 - Sentry 유틸 모듈에서 전역 변수 접근을 위함
    // node 환경에서는 접근가능하지만 그 외는 불가하기 때문에 process.env.블라브라 접근하기 위해서는 등록이 필요함.
    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0]["process.env"], {
        RUN_TYPE: JSON.stringify(process.env.RUN_TYPE),
        SENTRY: JSON.stringify(process.env.SENTRY) || JSON.stringify("off"),
      });
      return definitions;
    });

    //  Sentry 릴리즈를 위한 Webpack + Sentry 통합
    if (
      isProductionMode &&
      privateRunTypeEnv.SENTRY_DSN &&
      privateRunTypeEnv.SENTRY_PROJECT_NAME
    ) {
      const option = [
        {
          org: "",
          authToken: "",
          include: "./dist",
          project: privateRunTypeEnv.SENTRY_PROJECT_NAME || "",
          ignore: ["node_modules"],
          urlPrefix: "~/js",
          release: (() => {
            try {
              return execSync("git describe --abbrev=0 --tags")
                .toString()
                .trim();
            } catch (e) {
              return `${
                privateRunTypeEnv.SENTRY_PROJECT_NAME
              }-${new Date().toISOString()}`;
            }
          })(),
        },
      ];
      config.plugin("sentry").use(SentryWebpackPlugin, option);
    }
  },
  productionSourceMap: true,
  configureWebpack: {
    devtool: "source-map",
  },
};

config.transpileDependencies = true;
module.exports = config;
