export function compareVersions(version1: string, version2: string): number {
  const v1 = version1.split(".").map((v) => {
    if (v.includes("-")) {
      const [num, hotfix] = v.split("-");
      return [Number(num), hotfix];
    } else if (v.includes("v")) {
      return [Number(v[1])];
    } else {
      return [Number(v)];
    }
  });
  const v2 = version2.split(".").map((v) => {
    if (v.includes("-")) {
      const [num, hotfix] = v.split("-");
      return [Number(num), hotfix];
    } else if (v.includes("v")) {
      return [Number(v[1])];
    } else {
      return [Number(v)];
    }
  });

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const comp1 = i < v1.length ? v1[i] : [0];
    const comp2 = i < v2.length ? v2[i] : [0];
    if (comp1[0] < comp2[0]) {
      return -1;
    }
    if (comp1[0] > comp2[0]) {
      return 1;
    }
    if (comp1.length > 1 && comp2.length > 1) {
      const hotfix1 = comp1[1];
      const hotfix2 = comp2[1];
      if (hotfix1 < hotfix2) {
        return -1;
      }
      if (hotfix1 > hotfix2) {
        return 1;
      }
    } else if (comp1.length > 1) {
      return 1;
    } else if (comp2.length > 1) {
      return -1;
    }
  }
  return 0;
}
