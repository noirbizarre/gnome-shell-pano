import { EllipsizeMode } from '@imports/pango1';
import { Label } from '@imports/st1';
import { registerGObjectClass } from '@pano/utils/gjs';
import { markupCode } from '@pano/utils/pango';
import { PanoItemTypes } from '@pano/utils/panoItemType';
import { PanoItem } from '@pano/components/panoItem';
import { db } from '@pano/db';
import { ClipboardContent, clipboardManager, ContentType } from '@pano/utils/clipboardManager';

@registerGObjectClass
export class CodePanoItem extends PanoItem {
  private clipboardContent: string;

  constructor(content: string, date: Date) {
    super(PanoItemTypes.CODE, date);
    this.clipboardContent = content;

    this.body.style_class = [this.body.style_class, 'pano-item-body-code'].join(' ');

    const label = new Label({
      style_class: 'pano-item-body-code-content',
      clip_to_allocation: true,
    });
    label.clutter_text.use_markup = true;
    label.clutter_text.font_name = 'mono';
    label.clutter_text.set_markup(markupCode(this.clipboardContent));
    label.clutter_text.ellipsize = EllipsizeMode.END;
    this.body.add_child(label);

    db.save(ContentType.TEXT, this.clipboardContent, date);

    this.connect('activated', this.setClipboardContent.bind(this));
  }

  private setClipboardContent(): void {
    clipboardManager.setContent(
      new ClipboardContent({
        type: ContentType.TEXT,
        value: this.clipboardContent,
      }),
    );
  }
}
