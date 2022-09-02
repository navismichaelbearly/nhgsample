const Sdk =
  window.NhhFormSdk && window.NhhFormSdk.default ? window.NhhFormSdk.default : window.NhhFormSdk;

const formSdk = Sdk ? new Sdk() : {};

export default formSdk;
