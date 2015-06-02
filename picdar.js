import config from './picdar.config.json!';

const {composerUri} = config;

export function getPicdarViewUri(picdarUrn) {
    return `${composerUri}/image/picdarlibpick?imageId=${picdarUrn}&imageUsage='`;
};
