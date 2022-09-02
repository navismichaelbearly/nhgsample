const properties = Object.freeze({
  acceptedFileExtensions:
    '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.jpg,.png,.rtf,.htm,.html,.msg,.eml,.mht,.ics,.csv,.oft',
  maxFileSizeBytes: 1024 * 1024 * 20, // 20mb
  maxFilesDefault: 10,
  maxFilesNotes: 1,
});

export default properties;
