const idPart = (value: string) => encodeURIComponent(value);

export const getTabId = (baseId: string, value: string) => `${baseId}-tab-${idPart(value)}`;

export const getTabPanelId = (baseId: string, value: string) => `${baseId}-panel-${idPart(value)}`;
