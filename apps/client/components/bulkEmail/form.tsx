import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { SyntheticEvent } from 'react';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
import useTranslation from '../../hooks/useTranslation';
import { FormRepresentation, SetValue } from '../../hooks/useForm';
import TextField from '../memoizedInput/textField';
import BaseTextField from '../input/textField';
import Autocomplete from '../memoizedInput/autocomplete';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false },
);

function Form({
  formRepresentation,
  disabled,
  onSubmit,
  setValue,
}: {
  formRepresentation : FormRepresentation,
  disabled:boolean,
  onSubmit: (e: SyntheticEvent) => void,
  setValue: SetValue
}) {
  const { trans } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('basicDetails')}
          </Typography>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1 }}
            >
              <TextField
                sx={{ flex: 0.5, mr: '1rem' }}
                // error={Boolean(formRepresentation.name.error)}
                // helperText={formRepresentation.name.error}
                label={trans('emailForm.name.label')}
                placeholder={trans('emailForm.name.placeholder')}
                name="name"
                onChange={(e) => setValue({ field: 'name', value: e.target.value })}
                // value={formRepresentation.name.value}
              />
              <TextField
                sx={{ flex: 0.5 }}
                // error={Boolean(formRepresentation.kvk_nr.error)}
                // helperText={formRepresentation.kvk_nr.error}
                label={trans('emailForm.subject.label')}
                placeholder={trans('emailForm.subject.placeholder')}
                name="subject"
                onChange={(e) => setValue({ field: 'subject', value: e.target.value })}
                // value={formRepresentation.kvk_nr.value}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1 }}
            >
              <Autocomplete
                sx={{ flex: 0.5, mr: '1rem' }}
                multiple
                disabled={disabled}
                options={[]}
                filterSelectedOptions
                renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    name="senderEmail"
                    label={trans('emailForm.senderEmail.label')}
                    placeholder={trans('emailForm.senderEmail.placeholder')}
                  />
                )
               }
              />
              <TextField
                sx={{ flex: 0.5 }}
                // error={Boolean(formRepresentation.phone.error)}
                // helperText={formRepresentation.phone.error}
                label={trans('emailForm.senderName.label')}
                placeholder={trans('emailForm.senderName.placeholder')}
                name="senderName"
                onChange={(e) => setValue({ field: 'senderName', value: e.target.value })}
                // value={formRepresentation.phone.value}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flex: 1 }}
            >
              <Autocomplete
                fullWidth
                multiple
                disabled={disabled}
                options={[]}
                filterSelectedOptions
                renderInput={
                (params) => (
                  <BaseTextField
                    {...params}
                    label={trans('emailForm.recipients.label')}
                    placeholder={trans('emailForm.recipients.placeholder')}
                  />
                )
               }
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ mx: '1.5rem' }} />
        <CardContent>
          <Typography
            sx={{ mb: '2rem' }}
            variant="h4"
          >
            {trans('content')}
          </Typography>
          <Editor
            editorClassName="newCompanyEmailEditorWrapper"
          />
        </CardContent>
      </Card>
    </form>
  );
}

export default Form;
