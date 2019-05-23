const trackPercentage = (value, min, max, negative) => {
  let percentage = 0;
  if (value === 0) return `50%`;
  if (negative) {
    if (value <= 0) {
      percentage = parseInt((value / min / 2) * 100 - 50) * -1;
    } else {
      percentage = parseInt((value / max / 2) * 100 + 50);
    }
  } else {
    const maxtrack = Math.sign(min) * min + Math.sign(max) * max;
    percentage = parseInt((value / maxtrack) * 100);
  }
  return `${percentage}%`;
};

export const sliderOverrides = (checkState, negative) => ({
  TickBar: {
    style: {
      display: "none"
    }
  },
  InnerTrack: {
    style: ({ $theme, $value, $min, $max }) => ({
      color: !checkState
        ? $theme.colors.buttonDisabledText
        : $theme.colors.black,
      background: !checkState
        ? `linear-gradient(to right,
            ${$theme.colors.primary} 0%,
            ${$theme.colors.primary} 0%,
            ${$theme.colors.sliderTrackFill} 0%,
            ${$theme.colors.sliderTrackFill} 100%);`
        : `linear-gradient(to right,
            ${$theme.colors.primary} 0%,
            ${$theme.colors.primary} ${trackPercentage(
            $value,
            $min,
            $max,
            negative
          )},
            ${$theme.colors.sliderTrackFill} ${trackPercentage(
            $value,
            $min,
            $max,
            negative
          )},
            ${$theme.colors.sliderTrackFill} 100%);`
    })
  }
});

export const checkboxOverrides = {
  Label: {
    style: {
      fontWeight: "normal"
    }
  },
  Root: {
    style: {
      marginBottom: "10px",
      marginTop: "10px",
    }
  }
};
