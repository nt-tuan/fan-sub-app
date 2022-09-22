import React from "react";

export const useVideo = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState<{
    videoUrl: string;
    subtitleUrl: string;
  }>();
  React.useEffect(() => {
    setIsLoading(true);
    fetch("/video/data.json")
      .then((res) => res.json())
      .then((data) => setData(data as never))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading };
};
