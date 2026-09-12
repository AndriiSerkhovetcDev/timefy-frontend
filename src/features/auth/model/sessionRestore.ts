let sessionRestoreSuppressed = false;

export const suppressSessionRestore = () => {
  sessionRestoreSuppressed = true;
};

export const allowSessionRestore = () => {
  sessionRestoreSuppressed = false;
};

export const isSessionRestoreSuppressed = () => sessionRestoreSuppressed;
