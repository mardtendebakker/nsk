import { LinearProgress } from '@mui/material';

function TopLinearProgress() {
  return (
    <LinearProgress
      sx={{
        position: 'fixed',
        display: 'none',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1202,
      }}
      color="secondary"
      id="progress"
    />
  );
}

export default TopLinearProgress;

export const showProgress = () => {
  const progress: HTMLDivElement = document.querySelector('#progress');
  if (progress) {
    progress.style.display = 'unset';
  }
};

export const hideProgress = () => {
  const progress: HTMLDivElement = document.querySelector('#progress');
  if (progress) {
    progress.style.display = 'none';
  }
};
